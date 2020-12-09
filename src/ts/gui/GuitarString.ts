import { GUI } from "../gui";
import { NoteSet } from "../definitions/NoteSet";
import { GuitarStringNote } from "../GuitarStringNote";

export class GuitarString extends GUI.Element<HTMLDivElement> {
    notes: GuitarStringNote[];
    frets: number;

    constructor(noteSet: NoteSet, startingNote: string, openString: string, frets: Number) {
        super("div", "", "fret-guitar-string-" + startingNote);
        noteSet = noteSet;
        frets = frets;

        this.createOpenStringNote(openString, startingNote);
        this.createFretNotes(startingNote, frets);
    }

    private createOpenStringNote(openString: string, stratingNote: string) {
        document.querySelector(openString);

    }

    private createFretNotes(startingNote: string, frets: Number) {
        for (let i = 1; i < frets; i++) {
        }
    }
}
