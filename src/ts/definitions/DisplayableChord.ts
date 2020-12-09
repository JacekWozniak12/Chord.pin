import { Note } from "./Note";
import { Chord } from "./Chord";
import { NoteSet } from "./NoteSet";
import { VariableNotifier } from "./VariableNotifier";
import { DisplayableNote } from "./DisplayableNote";

class DisplayableChord extends Chord {

    notes: VariableNotifier<DisplayableNote[]>;
    noteSet: VariableNotifier<NoteSet>;

    constructor(notes: Note[], noteSet: NoteSet, name: string = "", description: string = "") {
        super(notes, name, description);
        this.noteSet = new VariableNotifier(noteSet);
    }

    addNote(note: DisplayableNote | Note, noteSet: NoteSet = null): this {
        if (note instanceof Note) {
            note = new DisplayableNote(note.name, 0, note.options, noteSet);
        }
        this.notes.var.unshift(note as DisplayableNote);
        return this;
    }

    deleteNote(note: DisplayableNote): this {
        this.notes.var = this.notes.var.filter(x => x.getPosition() != note.getPosition());
        return this;
    }

    deleteAllNoteInstances(note: Note): this {
        this.notes.var = this.notes.var.filter(x => x.name != note.name);
        return this;
    }

    setNotes(notes: Note[] | DisplayableNote[]) {
        this.notes = null;
        notes.forEach(element => {
            notes.push(new DisplayableNote(element.name, 0, element.options, this.noteSet.var));
        });
    }
}
