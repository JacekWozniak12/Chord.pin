import { Frequency } from "Tone";
import { Library } from './lib';
import { Notifier } from './observer';

export { Note, Chord, Options, DisplayableChord, DisplayableNote, NoteSet }

const MAX_DELAY = 10;
const MAX_DURATION = 10;
const MAX_VOLUME = 1;

class Note {

    constructor(name: string, transposition: number = null, options: Options = new Options()) {
        if (this.isValidName(name)) {
            this.name = Frequency(name).transpose(transposition).toNote();
            this.options = options;
        }
        else throw "Invalid note name";
    }

    name: string;
    options: Options;

    isValidName(name: string): boolean {
        let temp = name.toUpperCase().trim().
            replace(
                /([^ABCDEFG][^#b][^0-9]|[^ABCDEFG][^0-9])/g, ""
            );
        if (temp.length > 1 && temp.length < 4) return true;
        else return false;
    }
}

class DisplayableNote extends Note {
    private noteSet: NoteSet;
    private position: number;

    getPosition() { return this.position };

    constructor(name: string, transposition: number = null, options: Options = new Options(), noteSet: NoteSet) {
        super(name, transposition, options);
        if (noteSet.findPosition(this)) {
            this.noteSet = noteSet;
        }
        else throw "Note doesn't exist in this note set"
    }
}

class Chord {

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
        this.notes.var.forEach(element => { content = content.concat(element.name, " ^ ") });
        return content.slice(0, content.length - 2)
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

class NoteSet {
    private noteArray: VariableNotifier<Note[]>;

    findPosition(note: Note): number {
        return this.noteArray.var.indexOf(note);
    }

    constructor(startingNote: string | Note | DisplayableNote, amount: number) {
        
        this.noteArray = new VariableNotifier(new Array<Note>());
        let noteName = this.getNoteName(startingNote);

        for (let i = 0; i < amount; i++) {
            this.noteArray.var.push(new Note(noteName, i));
        }
    }

    private getNoteName(startingNote: string | Note | DisplayableNote) : string {
        if (startingNote instanceof Note) {
            return startingNote.name;
        }
        else {
            return startingNote;
        }
    }
}

class Options {

    constructor(
        volume: string | number = 0.5, duration: string | number = 1, delay: string | number = 0
    ) {
        try {
            this.volume = new VariableNotifier(Library.clamp(Number.parseFloat(volume as string), 0, MAX_VOLUME));
            this.delay = new VariableNotifier(Library.clamp(Number.parseFloat(delay as string), 0, MAX_DELAY));
            this.duration = new VariableNotifier(Library.clamp(Number.parseFloat(duration as string), 0, MAX_DURATION));
        }
        catch (e) {
            this.volume = new VariableNotifier(1);
            this.delay = new VariableNotifier(0);
            this.duration = new VariableNotifier(0.5);
            console.log(e + "\nWriting default options")
        }
    }

    getVolume(): number {
        return this.volume.var;
    }

    getDelay(): number {
        return this.delay.var;
    }

    getDuration(): number {
        return this.duration.var;
    }

    setVolume(value: string | number) {
        this.volume.var = Library.clamp(Number.parseFloat(value as string), 0, MAX_VOLUME);
        return this;
    }

    setDelay(value: string | number) {
        this.delay.var = Library.clamp(Number.parseFloat(value as string), 0, MAX_DELAY);
        return this;
    }

    setDuration(value: string | number) {
        this.duration.var = Library.clamp(Number.parseFloat(value as string), 0, MAX_DURATION);
        return this;
    }

    setValuesOf(options: Options) {
        this.setVolume(options.volume.var);
        this.setDelay(options.delay.var);
        this.setDuration(options.duration.var);
        return this;
    }

    private duration: VariableNotifier<number>;
    private delay: VariableNotifier<number>;
    private volume: VariableNotifier<number>;

}

class VariableNotifier<T> extends Notifier {

    constructor(value: T) {
        super();
        value = value;
    }

    private _var: T;

    get var(): T {
        return this._var;
    }

    set var(value: T) {
        if (this._var === value) return;
        else {
            this._var = value;
            this.notify();
        }
    }
}


