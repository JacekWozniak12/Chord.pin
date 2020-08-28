import { Frequency } from "Tone";

export {
    Note, Chord, Options
}

class Note {

    constructor(
        name: string,
        options: Options = new Options(),
        position: number = -1,
        transposition: number = null

    ) {
        if (this.isValidName(name)) {
            this.name = Frequency(name).transpose(transposition).toNote();
            this.options = options;
            this.fretboardPosition = position;
        }
        else throw "Invalid note name";
    }

    name: string;
    options: Options;
    fretboardPosition: number = -1;

    isValidName(name: string): boolean {
        let temp = name.
            toUpperCase().
            trim().
            replace(
                /([^ABCDEFG][^#b][^0-9]|[^ABCDEFG][^0-9])/g, ""
            );
        if (temp.length > 1 && temp.length < 4) return true;
        else return false;
    }
}

class Chord {

    constructor(
        notes: Note[],
        name: string = "",
        description: string = "",
        options: Options = null) {
        this.name = name;
        this.notes = notes;
        this.description = description;
    }

    name: string;
    description: string;
    notes: Note[];

    returnContent(): string {
        let s = "";

        this.notes.forEach(element => {
            s = s.concat(element.name, " ^ ")
        });

        return s.slice(0, s.length - 2)
    }

    addChord(chord: Chord): this{
        chord.notes.forEach(x =>
            this.notes.push(x)
            );
        return this;
    }
}

class Options {

    constructor(
        volume:     string | number = 0.5,
        duration:   string | number = 1,
        delay:      string | number = 0
    ) {
        try {
            this.volume = Number.parseFloat(volume as string);
            this.delay = Number.parseFloat(delay as string);
            this.duration = Number.parseFloat(duration as string);
        }
        catch (e) {
            this.duration = 1;
            this.delay = 0;
            throw "Argument Exception - Writing default options"
        }
    }
    
    get volume() : number | string{
        return this._volume;
    }

    get delay() : number | string{
        return this._delay;
    }

    get duration() : number | string{
        return this._duration;
    }

    set volume(value: number | string){
        this._volume = Options.clamp(Number.parseFloat(value as string), 0, 1) ?? 0.5;
    }

    set delay(value: number | string){
        this._delay = Options.clamp(Number.parseFloat(value as string), 0, 10) ?? 0;
    }

    set duration(value: number | string ){
        this._duration = Options.clamp(Number.parseFloat(value as string), 0, 10) ?? 1;
    }

    serialize(){
        return JSON.stringify({volume: this.volume, duration: this.duration, delay: this.delay})
    }

    private _volume: number = 0.5;
    private _duration: number = 1;
    private _delay: number = 0;

    static clamp(value: number, min: number, max: number): number {
        if (value > max) value = max;
        if (value < min) value = min;
        return value;
    }

    setValues(options: Options): this {
        this.delay =  options.delay ?? options._delay;
        this.duration = options.duration ?? options._duration;
        this.volume = options.volume ?? options._volume;
        return this;
    }
}

