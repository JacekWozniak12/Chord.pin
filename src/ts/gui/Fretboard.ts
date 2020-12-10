import { GUI } from "./GUI";
import { NotePosition } from "../Definitions/NotePosition";
import { Tuning } from "../Definitions/Tuning";
import { NoteSet } from "../Definitions/NoteSet";
import { Note } from "../Definitions/Note";
import { GuitarString } from "./GuitarString";

export class Fretboard extends GUI.Element<HTMLDivElement>
{
    noteSet: NoteSet;
    tuning: Tuning;
    frets: number;

    readonly zeroFretName: string = "fretZero";

    el_guitarStrings: GuitarString[];

    constructor(tuning: Tuning, frets: number, startingNote: string | Note | NotePosition, endingNote: string | Note | NotePosition) {
        super("div", "fretboard", "fretboard");
        this.frets = frets;
        this.el_guitarStrings = new Array<GuitarString>();
        this.noteSet = new NoteSet(startingNote, endingNote);
        this.tuning = tuning;
        let openString = new GUI.Element("div", this.zeroFretName, this.zeroFretName);

        if (tuning.canBeInNoteSet(this.noteSet)) {
            for (let i = 0; i < tuning.notes.var.length; i++) {
                this.el_guitarStrings.push(new GuitarString(this.noteSet, tuning.notes.var[i], openString.htmlElement, 24));
            }
        }
        else throw "Tuning can't be handled by current set of notes";

        this.parentElements([openString].concat(this.el_guitarStrings));
    }
}
