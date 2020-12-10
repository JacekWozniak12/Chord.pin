import { Note } from "./Note";
import { NoteSet } from "./NoteSet";
import { Options } from './Options';

export class NotePosition extends Note {
    private noteSet: NoteSet;
    private position: number;

    getPosition() { return this.position; };
    getNoteSet() { return this.noteSet };

    constructor(name: string, transposition: number = null, options: Options = new Options(), noteSet: NoteSet) {
        super(name, transposition, options);
        if (noteSet.findPosition(this)) {
            this.noteSet = noteSet;
        }
        else throw "Note doesn't exist in this note set";
    }
}
