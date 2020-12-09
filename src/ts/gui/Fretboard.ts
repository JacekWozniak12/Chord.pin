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
