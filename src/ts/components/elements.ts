import { Parser } from "../parser";
import { GUI } from "../gui";
import { Audio } from '../audio';
import { Options, Chord, Note } from "../definitions";
import { Frequency } from "Tone";
import { Database } from '../database';
import { NoteDisplay, SettingsDisplay, ChordContainer } from './DataRepresentation';
import { IObserve } from '../interfaces';

export class Fretboard extends GUI.Element<HTMLDivElement> implements IObserve{
    stringAmount = 6;
    frets = 25;
    startingFrequencyNote = ["E2", "A2", "D3", "G3", "B3", "E4"];
    noteBoardName: string = "fretboard"
    noteDisplayed: NoteDisplay[];

    constructor(database: Database, audio: Audio) {
        super("div", "", "board");
        this.noteDisplayed = new Array();
        let options = database.getOptions() ?? new Options();
        let position = 0;
        this.parentElements([
            new GUI.Element("div", "", "openString").htmlElement, new GUI.Element("div", "", this.noteBoardName).htmlElement
        ]);
        let currentNote = this.startingFrequencyNote[0];
        for (let i = 1; i < this.stringAmount + 1; i++) {
            new GUI.Element("div", "string", `string-${i}`, `#${this.noteBoardName}`);
            for (let j = 0; j < this.frets; j++) {
                currentNote = this.createNoteEl(i, j, currentNote, audio, options, position++);
            }
            currentNote = this.startingFrequencyNote[i];
        }
    }

    private createNoteEl(i: number, j: number, currentNote: string, audio: Audio, options: Options, position: number) {
        let part = `#string-${i}`;
        if (j == 0)
            part = "#openString";

        let noteDisplay = new NoteDisplay("note",
            currentNote.
                replace("#", "S").
                concat(`-string-${i}`),
            part, null, null,
            new Note(currentNote, new Options().setValues(options), position));

        this.setDefaultOptions(noteDisplay, options);

        noteDisplay = this.SetupNote(noteDisplay, currentNote, audio);
        this.noteDisplayed.push(noteDisplay);
        currentNote = Frequency(currentNote).transpose(1).toNote();
        return currentNote;
    }

    private setDefaultOptions(noteDisplay: NoteDisplay, options: Options) {
        noteDisplay.note.options.delay = options.delay;
        noteDisplay.note.options.duration = options.duration;
    }

    private SetupNote(note: NoteDisplay, currentNote: string, audio: Audio): NoteDisplay {
        note.addListener("click", note.toggle.bind(note)).
            addListener("mouseover", note.showOptions.bind(note)).
            addListener("mouseout", note.hideOptions.bind(note)).
            setText(currentNote.replace("S", "#")).
            setup(audio);
        return note;
    }

    changeDefaults(options: Options) {
        this.noteDisplayed.forEach(x => {
            if (!x.htmlElement.classList.contains("important-note-selected"))
                x.updateOptions(options);
        })
    }

    notifyHandler(object: Options | Chord){
        if(object instanceof Options)
            this.changeDefaults(object);
        if(object instanceof Chord)
            this.selectChord(object);
    }

    selectChord(chord: Chord, setNote: boolean = false): this {
        try {
            if(chord != null){
                this.clearSelection();
                chord.notes.forEach(x => {
                    if (x.fretboardPosition != -1)
                        if (setNote)
                            this.noteDisplayed.find(y => y.note.fretboardPosition == x.fretboardPosition).select(x);
                        else
                            this.noteDisplayed.find(y => y.note.fretboardPosition == x.fretboardPosition).select();
                    else
                        if (setNote) this.noteDisplayed.find(y => y.note.name == x.name).select(x);
                        else this.noteDisplayed.find(y => y.note.name == x.name).select();
                });
                return this;
            }
        }
        catch (e) {
            console.log(e);
        }
    }

    clearSelection(): this {
        this.noteDisplayed.forEach(x => {
            x.deselect();
        })
        return this;
    }
}

export class ChordAdd extends GUI.Element<HTMLButtonElement>{

    database: Database;
    audio: Audio;
    add_button: GUI.Element<HTMLElement>;
    input: GUI.InputElement<HTMLInputElement>;

    constructor(database: Database, audio: Audio) {
        super("div", "");
        this.database = database;
        this.audio = audio;
        this.add_button = new GUI.Element("div",
            "icon", "", "", "https://img.icons8.com/windows/32/000000/plus-math.png",
            "click", this.addChord.bind(this));
        this.input = new GUI.InputElement("input")
        this.parentElements([this.add_button.htmlElement, this.input.htmlElement]);
    }

    addChord() {
        let name = this.input.getValue();
        let chordObject = this.audio.getChord();
        chordObject.notes = chordObject.notes.sort(n => n.fretboardPosition);

        if (chordObject == null || chordObject.notes.length < 1) return;
        if (name == "null" || name == "") name = "Chord " + chordObject.returnContent().trim();

        this.database.addChord(
            new Chord(chordObject.notes, name, "")
        );
    }

}

export class ChordSelector extends GUI.Element<HTMLSelectElement>{

    database: Database;
    fretboard: Fretboard;

    constructor(database: Database, fretboard: Fretboard, audio: Audio) {
        super("select", "");
        this.database = database;
        this.fretboard = fretboard;
        this.database.subscribe(this.getListFromDatabase.bind(this));
        this.getListFromDatabase();
        this.addListener("change", this.select.bind(this));
        this.addListener("change", audio.stop.bind(audio));
        this?.select();
    }

    getCurrentSelection(): string {
        return this.htmlElement.selectedOptions[0]?.value;
    }

    /*todo - bugging out selection*/
    getListFromDatabase(): this {
        this.clearSelectables();
        let chords = this.database.getChords();

        chords.forEach(x => {
            let selectable = new ChordContainer(x);

            this.parentElements([selectable.htmlElement])
        });
        this.select();
        return this;
    }

    select(): this {
        let value = this.getCurrentSelection();
        let promise = this.database.getChord(value);
        if (promise != null) this.fretboard.selectChord(promise, true);
        return this;
    }

    clearSelectables() {
        this.fretboard.clearSelection();
        this.htmlElement.childNodes.forEach(x => {
            this.htmlElement.removeChild(x);
        })
    }

    deleteSelected() {
        this.database.deleteChord(this.getCurrentSelection());
        this.htmlElement.options.remove(this.htmlElement.selectedIndex);
    }
}

export class ChordPlayer extends GUI.Element<HTMLElement>{
    el_play: GUI.Element<HTMLDivElement>;
    audio: Audio;
    currentChord: Chord;

    constructor(audio: Audio) {
        super("div", "icon", "", "body", "https://img.icons8.com/ios-glyphs/32/000000/play.png");
        this.audio = audio;
        this.addListener("click", this.play.bind(this));
    }

    play() {
        this.audio.stop();
        this.audio.play(this.currentChord);
    }
}

export class ChordDelete extends GUI.Element<HTMLDivElement>{

    chordSelector: ChordSelector;
    delete_button: GUI.Element<HTMLElement>;

    constructor(chordSelector: ChordSelector) {
        super("div", "");
        this.chordSelector = chordSelector;
        this.delete_button = new GUI.Element("div",
            "icon", "", "", "https://img.icons8.com/windows/32/000000/minus-math.png",
            "click", this.deleteChord.bind(this));
        this.parentElements([this.delete_button.htmlElement]);
    }

    deleteChord() {
        this.chordSelector.deleteSelected();
    }
}

export class MenuPlayer extends GUI.Element<HTMLDivElement>{

    player: ChordPlayer;
    chordSelector: ChordSelector;
    chordAdd: ChordAdd;
    chordDelete: ChordDelete;

    constructor(database: Database, audio: Audio, fretboard: Fretboard) {
        super("div", "Menu");
        this.chordSelector = new ChordSelector(database, fretboard, audio);
        this.chordAdd = new ChordAdd(database, audio);
        this.chordDelete = new ChordDelete(this.chordSelector);
        this.player = new ChordPlayer(audio);
        this.parentElements(
            [this.chordSelector.htmlElement,
            this.chordAdd.htmlElement,
            this.chordDelete.htmlElement,
            this.player.htmlElement]
        )
    }
}

export class MenuSettings extends GUI.Element<HTMLDivElement>{

    settings: SettingsDisplay;
    database: Database;

    constructor(database: Database) {
        super("div");
        this.database = database;
        this.settings = new SettingsDisplay(database.getOptions());
        this.parentElements([this.settings.htmlElement]);

        this.settings.el_duration.addListener(
            "change", this.sendToDatabase.bind(this)
        );
        this.settings.el_delay.addListener(
            "change", this.sendToDatabase.bind(this)
        );
        this.settings.el_volume.addListener(
            "change", this.sendToDatabase.bind(this)
        );
    }

    sendToDatabase() {
        this.database.setOptions(this.settings.options);
    }
}

export class Prompt extends GUI.Element<HTMLInputElement>{

    parser: Parser;
    audio: Audio;
    database: Database;

    constructor(promptID: string, audio: Audio, database: Database) {
        super("input", "input", promptID)
        this.parser = new Parser(this.htmlElement, database);
        this.audio = audio;
        this.htmlElement.setAttribute("placeholder", "...write command here");
    }

    notify(info: string) {
        this.htmlElement.value = info;
    }

    apply(): this {
        return this;
    }
}
