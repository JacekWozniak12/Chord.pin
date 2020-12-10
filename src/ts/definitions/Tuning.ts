import { NoteSet } from "./NoteSet";
import { VariableNotifier } from "./Observer";

export class Tuning {

    notes: VariableNotifier<string[]>;

    constructor(notes: string[]) {
        this.notes = new VariableNotifier(notes);
    }

    canBeInNoteSet(noteset: NoteSet): boolean {
        this.notes.variable.forEach(e => {
            if (noteset.findPosition(e) == -1)
                return false;
        });
        return true;
    }

    toString(): string {
        return this.notes.variable.join("-");
    }

}
