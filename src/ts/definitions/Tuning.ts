import { NoteSet } from "./NoteSet";
import { VariableNotifier } from "./VariableNotifier";

export class Tuning {

    notes: VariableNotifier<string[]>;

    constructor(...params: string[]) {
        this.notes.var = params;
    }

    canBeInNoteSet(noteset: NoteSet): boolean {
        this.notes.var.forEach(e => {
            if (noteset.findPosition(e) == -1)
                return false;
        });
        return true;
    }

}
