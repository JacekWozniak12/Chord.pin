import { Note } from "./Note";
import { Chord } from "./Chord";
import { NoteSet } from "./NoteSet";
import { NotePosition } from "./NotePosition";
import { VariableNotifier } from "./Observer";

export class DisplayableChord extends Chord {

    notes: VariableNotifier<NotePosition[]>;
    noteSet: VariableNotifier<NoteSet>;

    constructor(notes: Note[], noteSet: NoteSet, name: string = "", description: string = "") {
        super(notes, name, description);
        this.noteSet = new VariableNotifier(noteSet);
    }

    addNote(note: NotePosition | Note, noteSet: NoteSet = null): this {
        if (note instanceof Note) {
            note = new NotePosition(note.name, 0, note.options, noteSet);
        }
        this.notes.var.unshift(note as NotePosition);
        return this;
    }

    deleteNote(note: NotePosition): this {
        this.notes.var = this.notes.var.filter(x => x.getPosition() != note.getPosition());
        return this;
    }

    deleteAllNoteInstances(note: Note): this {
        this.notes.var = this.notes.var.filter(x => x.name != note.name);
        return this;
    }

    setNotes(notes: Note[] | NotePosition[]) {
        this.notes = null;
        notes.forEach(element => {
            notes.push(new NotePosition(element.name, 0, element.options, this.noteSet.var));
        });
    }
}
