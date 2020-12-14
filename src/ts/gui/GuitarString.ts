import { GUI } from "./GUI";
import { NoteSet } from "../definitions/NoteSet";
import { GuitarStringNote } from "./GuitarStringNote";
import { Fretboard } from "./Fretboard";


export class GuitarString extends GUI.Element<HTMLDivElement>{
    frets: number;

    constructor(set: NoteSet, startingNote: string, openString: HTMLElement, frets: Number, fretboard: Fretboard) {
        super("div", "string");
        frets = frets;
        this.createOpenStringNote(openString, startingNote, set, fretboard);
        this.createFretNotes(startingNote, frets, set, fretboard);
    }

    private createOpenStringNote(openString: HTMLElement, startingNote: string, set: NoteSet, fretboard: Fretboard) {
        let note = new GuitarStringNote(startingNote, 0, set);
        note.selectedEvent.subscribe(x => fretboard.selectedNotes.push(x));
        note.deselectedEvent.subscribe(x => fretboard.selectedNotes.find(x));
        openString.appendChild(note.html);
    }

    private createFretNotes(startingNote: string, frets: Number, set: NoteSet, fretboard: Fretboard) {
        for (let i = 1; i < frets; i++) {
            let note = new GuitarStringNote(startingNote, i, set);
            this.parentElements([note]);
        }
    }
}
