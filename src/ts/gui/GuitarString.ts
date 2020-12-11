import { GUI } from "./GUI";
import { NoteSet } from "../definitions/NoteSet";
import { GuitarStringNote } from "./GuitarStringNote";
import { Fretboard } from "./Fretboard";


export class GuitarString extends GUI.Element<HTMLDivElement>{
    frets: number;

    constructor(set: NoteSet, startingNote: string, openString: HTMLElement, frets: Number, fretboard: Fretboard) {
        let id = "guitar-string-" + startingNote;
        super("div", "string", id);
        frets = frets;
        this.createOpenStringNote(openString, startingNote, set, id, fretboard);
        this.createFretNotes(startingNote, frets, set, id, fretboard);
    }

    private createOpenStringNote(openString: HTMLElement, startingNote: string, set: NoteSet, id: string, fretboard: Fretboard) {
        let note = new GuitarStringNote(startingNote, 0, set, id);
        note.selectedEvent.subscribe(x => fretboard.notes.push(x));
        note.deselectedEvent.subscribe(x => fretboard.notes.find(x));
        openString.appendChild(note.html);
    }

    private createFretNotes(startingNote: string, frets: Number, set: NoteSet, id: string, fretboard: Fretboard) {
        for (let i = 1; i < frets; i++) {
            let note = new GuitarStringNote(startingNote, i, set, id);
            this.parentElements([note]);
        }
    }
}
