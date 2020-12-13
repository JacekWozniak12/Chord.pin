import { GUI } from "./GUI";
import { NotePosition } from "../definitions/NotePosition";
import { Tuning } from "../definitions/Tuning";
import { NoteSet } from "../definitions/NoteSet";
import { Note } from "../definitions/Note";
import { GuitarString } from "./GuitarString";
import { Chord } from "../definitions/Chord";
import { Notifier } from "../definitions/Observer";

export class Fretboard extends GUI.Element<HTMLDivElement>
{
    noteSet: NoteSet;
    selectedNotes : NotePosition[];
    tuning: Tuning;
    frets: number;
    addEvent: Notifier<Chord>;

    readonly zeroFretName: string = "openString";

    constructor(tuning: Tuning, frets: number, startingNote: string | Note | NotePosition, endingNote: string | Note | NotePosition) {
        super("div", "tuning-" + tuning);
        this.frets = frets;
        this.noteSet = new NoteSet(startingNote, endingNote);
        this.tuning = tuning;
        this.addEvent = new Notifier<Chord>();
        this.createAddButton();
        this.createCollections(tuning);
    }

    private createAddButton() {
        let btn = new GUI.Element("button").setText("add");
        btn.addListener("click", this.addNotesFromFretboard);
    }

    addNotesFromFretboard() {
        let chord = new Chord(this.selectedNotes);
        this.addEvent.notify(chord);
        return chord;
    }

    private createCollections(tuning: Tuning) {
        let openString = new GUI.Element("div", this.zeroFretName, this.zeroFretName);
        let stringCollection = new GUI.Element("div", "", "fretboard");
        this.handleTuning(tuning, openString, stringCollection);
        this.parentElements([openString, stringCollection]);
    }

    private handleTuning(tuning: Tuning, openString: GUI.Element<HTMLElement>, stringCollection: GUI.Element<HTMLElement>) {
        let collection = new Array<GuitarString>();

        if (tuning.canBeInNoteSet(this.noteSet)) {
            for (let i = 0; i < tuning.notes.variable.length; i++) {
                collection.push(new GuitarString(this.noteSet, tuning.notes.variable[i], openString.html, 24, this));
            }
            stringCollection.parentElements(collection);
        }
        else
            throw "Tuning can't be handled by current set of notes";
    }
}
