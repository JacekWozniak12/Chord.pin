import { GUI } from "../gui";
import { DisplayableNote } from "../definitions/DisplayableNote";
import { Tuning } from "../definitions/Tuning";
import { NoteSet } from "../definitions/NoteSet";
import { Note } from "../definitions/Note";
import { GuitarString } from "./GuitarString";

class Fretboard extends GUI.Element<HTMLDivElement>
{
    noteSet: NoteSet;
    tuning: Tuning;
    frets: number;

    readonly zeroFretName: string = "fretZero";

    el_guitarStrings: GuitarString[];

    constructor(tuning: Tuning, frets: number, startingNote: string | Note | DisplayableNote, endingNote: string | Note | DisplayableNote) {
        super();

        this.frets = frets;
        this.el_guitarStrings = new Array<GuitarString>();
        this.noteSet = new NoteSet(startingNote, endingNote);
        this.tuning = tuning;

        if (!tuning.canBeInNoteSet(this.noteSet))
            throw "Tuning can't be handled by current set of notes";
        else {
            for (let i = 0; i < tuning.notes.var.length; i++) {
            }
        }
    }
}
