import { Frequency } from "Tone";
import { Note } from "./Note";
import { NotePosition } from "./NotePosition";
import { Options } from "./Options";
import { MAX_NOTESET_SIZE } from "./Const";
import { VariableNotifier } from "./Observer";

export class NoteSet {

    private noteArray: VariableNotifier<Note[]>;
    
    findPosition(note: Note | string): number {
        if (note instanceof Note)
            return this.noteArray.variable.indexOf(note);
        else
            return this.noteArray.variable.indexOf((this.noteArray.variable.filter(e => e.name == note)[0]));
    }

    constructor(startingNote: string | Note | NotePosition, endingNote: string | Note | NotePosition) {

        this.noteArray = new VariableNotifier(Array<Note>());
        this.setNoteArray(startingNote, endingNote);
    }

    private setNoteArray(startingNote: string | Note | NotePosition, endingNote: string | Note | NotePosition) {

        startingNote = this.getNoteName(startingNote);
        endingNote = this.getNoteName(endingNote);

        let index = 0;
        let noteName = startingNote;

        while (index < MAX_NOTESET_SIZE && Frequency(startingNote).transpose(index).toNote() != endingNote) {
            this.noteArray.variable.push(new NotePosition(noteName, index, new Options(), this));
            index++;
        }
    }

    private getNoteName(startingNote: string | Note | NotePosition): string {
        if (startingNote instanceof Note) return startingNote.name;
        else return startingNote;
    }
}
