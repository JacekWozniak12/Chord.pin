import { GUI } from "../gui/GUI";
import { Note } from "./Note";
import { VariableNotifier } from "./Observer";
import { ChordList } from "../gui/ChordList";

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
        this.notes.variable.forEach(e => { content = content.concat(e.name, " ^ "); });
        return content.slice(0, content.length - 2);
    }

    addChord(chord: Chord): this {
        chord.notes.variable.forEach(x => this.notes.variable.push(x));
        return this;
    }

    setValuesOf(chord: Chord): this {
        this.name.variable = chord.name.variable;
        this.setNotes(chord.notes.variable);
        this.description.variable = chord.description.variable;
        return this;
    }

    setNotes(notes: Note[]) {
        this.notes.variable = notes;
    }

    createSelectable(list: ChordList): GUI.Element<HTMLOptionElement> {
        let chordName = this.returnContent();
        let selectable = new GUI.Element<HTMLOptionElement>("option", chordName);
        selectable.modifyAttribute("value", chordName);
        selectable.setText(chordName);
        list.parentElements([selectable]);
        return selectable;
    }
}
