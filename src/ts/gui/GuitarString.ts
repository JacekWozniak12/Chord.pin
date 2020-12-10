import { GUI } from "./GUI";
import { NoteSet } from "../Definitions/NoteSet";
import { GuitarStringNote } from "./GuitarStringNote";

export class GuitarString extends GUI.Element<HTMLDivElement> {
    notes: GuitarStringNote[];
    frets: number;

    constructor(set: NoteSet, startingNote: string, openString: HTMLElement, frets: Number) {
        let id = "guitar-string-" + startingNote;
        super("div", "", id);
        frets = frets;
        this.notes = new Array<GuitarStringNote>();
        this.createOpenStringNote(openString, startingNote, set, id);
        this.createFretNotes(startingNote, frets, set, id);
    }

    private createOpenStringNote(openString: HTMLElement, startingNote: string, set: NoteSet, id: string) {
        let note = new GuitarStringNote(startingNote, 0, set, id);
        openString.appendChild(note.htmlElement);
        this.notes.push(note);
    }

    private createFretNotes(startingNote: string, frets: Number, set: NoteSet, id: string) {
        for (let i = 1; i < frets; i++) {
            let note = new GuitarStringNote(startingNote, i, set, id);
            this.parentElements([note]);
            this.notes.push(note);
        }
    }
}
