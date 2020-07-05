import { Parser } from "./parser";
import { GUI } from "./gui";
import { Audio } from './audio';
import { Options, Chord, Note } from "./definitions";
import { Frequency } from "Tone";
import { Database } from './database';

// describes items used to built app
export module Components {

    export module Interfaces {

        export class Fretboard extends GUI.Element<HTMLDivElement>{
            stringAmount = 6;
            frets = 25;
            startingFrequencyNote = ["E2", "A2", "D3", "G3", "B3", "E4"];
            noteBoardName: string = "fretboard"
            noteDisplayed: Data.NoteDisplay[];

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

                let note = new Data.NoteDisplay("div", "note",
                    currentNote.
                        replace("#", "S").
                        concat(`-string-${i}`),
                    part, null, null,
                    new Note(currentNote, options, position), `string-{i}`);

                note = this.SetupNote(note, currentNote, audio);
                this.noteDisplayed.push(note);
                currentNote = Frequency(currentNote).transpose(1).toNote();
                return currentNote;
            }

            private SetupNote(note: Data.NoteDisplay, currentNote: string, audio: Audio): Data.NoteDisplay {
                note.addListener("click", note.toggle.bind(note)).
                    addListener("mouseover", note.showOptions.bind(note)).
                    addListener("mouseout", note.hideOptions.bind(note)).
                    setText(currentNote.replace("S", "#")).
                    setup(audio);
                return note;
            }

            selectChord(chord: Chord): this {
                this.clearSelection();
                chord.notes.forEach(x => {
                    try {
                        this.noteDisplayed.find(y => y.note.fretboardPosition == x.fretboardPosition).select();
                    }
                    catch{
                        this.noteDisplayed.find(y => y.note.name == x.name).select();
                    }
                });
                return this;
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
            input: GUI.InputElement<HTMLInputElement>

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

                if (chordObject == null || chordObject.notes.length < 1) return;
                if (name == "null" || name == "") name = "Chord " + chordObject.returnContent().trim();

                this.database.addChord(
                    new Chord(chordObject.notes, name, "", chordObject.options)
                );
            }

        }

        export class ChordSelector extends GUI.Element<HTMLSelectElement>{

            database: Database;
            fretboard: Fretboard;

            constructor(database: Database, fretboard: Fretboard) {
                super("select", "");
                this.database = database;
                this.fretboard = fretboard;
                this.database.toNotifyChordChange.push(this.getListFromDatabase.bind(this));
                this.getListFromDatabase();
                this.addListener("input", this.select.bind(this));
            }

            getCurrentSelection(): string {
                return this.htmlElement.selectedOptions[0]?.value;
            }

            getListFromDatabase(): this {
                let chords = this.database.getChords();
                this.clearSelectables();

                chords.forEach(x => {
                    let selectable =
                        new GUI.Element<HTMLOptionElement>("option").
                            modifyAttribute("value", `${x.name}`).
                            setText(`${x.name}`);

                    this.parentElements([selectable.htmlElement])
                });
                return this;
            }

            select(): this {
                let value = this.getCurrentSelection();
                this.fretboard.selectChord(this.database.getChord(value));
                return this;
            }

            clearSelectables() {
                this.htmlElement.childNodes.forEach(x => {
                    this.htmlElement.removeChild(x);
                })
            }

            deleteSelected() {
                this.database.deleteChord(this.getCurrentSelection());
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

            player: Player;
            chordSelector: ChordSelector;
            chordAdd: ChordAdd;
            chordDelete: ChordDelete;

            constructor(database: Database, audio: Audio, fretboard: Fretboard) {
                super("div", "Menu");
                this.chordSelector = new ChordSelector(database, fretboard);
                this.chordAdd = new ChordAdd(database, audio);
                this.chordDelete = new ChordDelete(this.chordSelector);
            }
        }

        export class MenuSettings extends GUI.Element<HTMLDivElement>{

            settings: Data.SettingsDisplay;
            database: Database;

            constructor(database: Database) {
                super("div");
                this.database = database;
                this.settings = new Data.SettingsDisplay();
                this.settings.setOptions(database.getOptions());
                this.parentElements([this.settings.htmlElement]);
            }

        }

        export class Prompt extends GUI.Element<HTMLInputElement>{

            parser: Parser;
            audio: Audio;

            constructor(promptID: string, audio: Audio) {
                super("input", "input", promptID)
                this.parser = new Parser(this.htmlElement);
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

        export class Player extends GUI.Element<HTMLElement>{
            el_play: GUI.Element<HTMLDivElement>;
            audio: Audio;
            currentChord: Chord;

            constructor(audio: Audio) {
                super("div", "icon", "", "body", "https://img.icons8.com/ios-glyphs/32/000000/play.png");
                this.audio = audio;
                this.addListener("click", this.play.bind(this));
            }

            play() {
                this.audio.play(this.currentChord);
            }
        }
    }

    export module Data {

        export class NoteDisplay extends GUI.Element<HTMLDivElement> {

            note: Note;
            collectionId: string;
            add: GUI.Element<HTMLDivElement>;
            del: GUI.Element<HTMLDivElement>;
            settings: SettingsDisplay;
            audio: Audio;
            selected: boolean = false;

            constructor(type: string, className: string, id: string = null,
                parent: string = "body", trigger: string, f: EventListener, note: Note, collectionId: string) {
                super(type, className, id, parent, "", trigger, f);
                this.settings = new SettingsDisplay(note);
                this.settings.htmlElement.classList.add("hidden");
                this.note = note;
                this.collectionId = collectionId;
            }

            setup(audio: Audio): this {
                this.audio = audio;
                this.parentElements([this.settings.htmlElement]);
                return this;
            }

            showOptions() {
                this.settings.htmlElement.classList.remove("hidden");
            }

            hideOptions() {
                this.settings.htmlElement.classList.add("hidden");
            }

            clear() {
                let found = document.querySelectorAll("note-selected");
                found.forEach(x => {
                    x.classList.remove("note-selected");
                    x.classList.remove("important-note-selected");
                });
            }

            select() {
                this.htmlElement.classList.add("note-selected", "important-note-selected");
                let found = document.querySelectorAll(`div[id*="${this.note.name.replace("#", "S")}"]`);
                found.forEach(x => {
                    x.classList.add("note-selected");
                });
            }

            deselect() {
                this.htmlElement.classList.remove("note-selected", "important-note-selected")
                
                let found = document.querySelectorAll(`div.important-note-selected[id*="${this.note.name.replace("#", "S")}"]`);
                
                console.log(found);   
                if(found.length == 0){
                    found = document.querySelectorAll(`div[id*="${this.note.name.replace("#", "S")}"]`);           
                    found.forEach(x => {
                        x.classList.remove("note-selected");
                    });
                }
            }

            toggle() {
                if(this.htmlElement.classList.contains("important-note-selected")){
                    this.deselect();
                }
                else this.select()
            }
        }

        export class SettingsDisplay extends GUI.Element<HTMLElement>{

            el_title: GUI.Element<HTMLDivElement>;
            el_volume: GUI.Element<HTMLInputElement>;
            el_duration: GUI.Element<HTMLInputElement>;
            el_delay: GUI.Element<HTMLInputElement>;

            options: Options;

            constructor(
                note: Note = null,
                type: string = "div",
                className: string = "settings",
                id: string = null,
                parent: string = "body"
            ) {
                super(type, className, id, parent);
                this.createVolume();
                this.createDuration();
                this.createDelay();
                this.options = note?.options;

                if (this.options != null) {
                    this.el_volume.htmlElement.value = <any>this.options.volume;
                    this.el_delay.htmlElement.value = <any>this.options.delay;
                    this.el_duration.htmlElement.value = <any>this.options.duration;
                }
                else this.options = new Options;
            }

            setOptions(options: Options): this {
                this.options = options;
                return this;
            }

            private updateVolume(): this {
                this.options.volume = Number.parseFloat(this.el_volume.htmlElement.value);
                return this;
            }

            private updateDuration(): this {
                this.options.setDuration(Number.parseFloat(this.el_duration.htmlElement.value));
                return this;
            }

            private updateDelay(): this {
                this.options.setDelay(Number.parseFloat(this.el_delay.htmlElement.value))
                return this;
            }

            private createSettings(type: string, className: string, id: string, img: string): GUI.Element<HTMLElement> {
                let i = new GUI.Element("img").modifyAttribute("src", img);
                let r = new GUI.Element(type, className, id);
                let u = new GUI.Element("div", "setting-container");
                u.parentElements([i.htmlElement, r.htmlElement]);
                this.parentElements([u.htmlElement]);
                return r;
            }

            private createDelay() {
                this.el_delay = <any>this.createSettings("input", "", "", "https://img.icons8.com/windows/32/000000/add-time.png").
                    modifyAttribute("placeholder", "00").modifyAttribute("type", "number").modifyAttribute("min", "0").modifyAttribute("max", "10").
                    addListener("change", this.updateDelay.bind(this));
            }

            private createDuration() {
                this.el_duration = <any>this.createSettings("input", "", "", "https://img.icons8.com/windows/32/000000/time-slider.png").
                    modifyAttribute("placeholder", "01").modifyAttribute("type", "number").modifyAttribute("min", "0").modifyAttribute("max", "10").
                    addListener("change", this.updateDuration.bind(this));
            }

            createVolume() {
                this.el_volume = <any>this.createSettings("input", "", "", "https://img.icons8.com/windows/32/000000/speaker.png").
                    modifyAttribute("type", "range").modifyAttribute("min", "0").modifyAttribute("max", "1").modifyAttribute("step", "0.01").
                    addListener("change", this.updateVolume.bind(this));
            }
        }

    }
}