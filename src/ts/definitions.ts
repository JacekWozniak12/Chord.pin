import { Frequency } from "Tone";
import { Library } from './lib';
import { Fretboard } from './components/elements';

export { Note, Chord, Options }

class Note {

    constructor(name: string, options: Options = new Options(), transposition: number = null) {
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

class PositionedNote extends Note {
    noteSet: NoteSet;
    position: Number;

    constructor(name: string, options: Options = new Options(), noteSet : NoteSet, transposition: number = null) {
        super(name, options, transposition);
        if(noteSet.findPosition(this)){
            this.noteSet = noteSet; 
        }
        else throw "Note doesn't exist in this note set"      
    }
}

class NoteSet {
    noteArray: Note[];

    findPosition(note: Note): Number {
        return this.noteArray.indexOf(note);
    }
}

class Chord {

    constructor(notes: Note[], name: string = "", description: string = "") {
        this.name = name;
        this.notes = notes;
        this.description = description;
    }

    name: string;
    description: string;
    notes: Note[];

    returnContent(): string {
        let s = "";
        this.notes.forEach(element => { s = s.concat(element.name, " ^ ") });
        return s.slice(0, s.length - 2)
    }

    addChord(chord: Chord): this {
        chord.notes.forEach(x => this.notes.push(x));
        return this;
    }

    setValuesOf(chord: Chord): this {
        this.name = chord.name;
        this.notes = chord.notes;
        this.description = chord.description;
        return this;
    }
}

class Options {

    constructor(
        volume: string | number = 0.5, duration: string | number = 1, delay: string | number = 0
    ) {
        try {
            this.volume = Number.parseFloat(volume as string);
            this.delay = Number.parseFloat(delay as string);
            this.duration = Number.parseFloat(duration as string);
        }
        catch (e) {
            this.duration = 1;
            this.delay = 0;
            this.volume = 0.5;
            throw "Argument Exception - Writing default options"
        }
    }

    private _volume: number = 0.5;
    private _duration: number = 1;
    private _delay: number = 0;

    get volume(): number | string {
        return this._volume;
    }

    get delay(): number | string {
        return this._delay;
    }

    get duration(): number | string {
        return this._duration;
    }

    set volume(value: number | string) {
        this._volume = Library.clamp(Number.parseFloat(value as string), 0, 1) ?? 0.5;
    }

    set delay(value: number | string) {
        this._delay = Library.clamp(Number.parseFloat(value as string), 0, 10) ?? 0;
    }

    set duration(value: number | string) {
        this._duration = Library.clamp(Number.parseFloat(value as string), 0, 10) ?? 1;
    }

    serialize() {
        return JSON.stringify({ volume: this.volume, duration: this.duration, delay: this.delay })
    }

    setValuesOf(options: Options): this {
        this.delay = options.delay ?? options._delay;
        this.duration = options.duration ?? options._duration;
        this.volume = options.volume ?? options._volume;
        return this;
    }
}

