import { Frequency } from "Tone";
import { Note } from "./Note";
import { DisplayableNote } from "./DisplayableNote";
import { VariableNotifier } from "./VariableNotifier";
import { Options } from "./Options";

export class NoteSet {

    private noteArray: VariableNotifier<Note[]>;
    private static readonly MAX_SIZE: number = 144;

    findPosition(note: Note | string): number {
        if (note instanceof Note)
            return this.noteArray.var.indexOf(note);
        else
            return this.noteArray.var.indexOf((this.noteArray.var.filter(e => e.name == note)[0]));
    }

    constructor(startingNote: string | Note | DisplayableNote, endingNote: string | Note | DisplayableNote) {

        this.noteArray = new VariableNotifier(new Array<Note>());

        startingNote = this.getNoteName(startingNote);
        endingNote = this.getNoteName(endingNote);

        let index = 0;

        while (index < NoteSet.MAX_SIZE && Frequency(startingNote).transpose(index).toNote() != endingNote) {
            this.noteArray.var.push(new DisplayableNote(name, index, new Options(), this));
            index++;
        }
    }

    private getNoteName(startingNote: string | Note | DisplayableNote): string {
        if (startingNote instanceof Note) {
            return startingNote.name;
        }
        else {
            return startingNote;
        }
    }
}
