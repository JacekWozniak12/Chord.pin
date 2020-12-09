import { Note } from "./Note";
import { VariableNotifier } from "./VariableNotifier";

export class Chord {

    constructor(notes: Note[], name: string = "", description: string = "") {
        this.name = new VariableNotifier(name);
        this.notes = new VariableNotifier(notes);
        this.description = new VariableNotifier(description);
    }

    name: VariableNotifier<string>;
    description: VariableNotifier<string>;
    notes: VariableNotifier<Note[]>;

    returnContent(): string {
        let content = "";
        this.notes.var.forEach(element => { content = content.concat(element.name, " ^ "); });
        return content.slice(0, content.length - 2);
    }

    addChord(chord: Chord): this {
        chord.notes.var.forEach(x => this.notes.var.push(x));
        return this;
    }

    setValuesOf(chord: Chord): this {
        this.name.var = chord.name.var;
        this.setNotes(chord.notes.var);
        this.description.var = chord.description.var;
        return this;
    }

    setNotes(notes: Note[]) {
        this.notes.var = notes;
    }
}
