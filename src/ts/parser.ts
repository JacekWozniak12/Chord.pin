import { Options, Note, Chord } from "./definitions";
import { Database } from './database';
import { } from './components';

// Delimiters
enum D_START {
    S_CHORD = "{",
    S_OPTIONS = "("
}
enum D_END {
    S_CHORD = "}",
    S_OPTIONS = ")"
}

export class Parser {

    database: Database;
    prompt: HTMLInputElement;

    // symbols start
    static readonly S_LOADING = "<<";
    static readonly S_SAVE = ">>";
    static readonly S_DELAY = "d:";
    static readonly S_DURATION = "t:";
    static readonly S_VOLUME = "v:";
    static readonly S_CHORD_CONCAT = "^";
    static readonly S_STEP_SUB = "-";
    static readonly S_STEP_ADD = "+";
    static readonly S_PARAMETER_NEXT = ",";
    // symbols stop

    static readonly SYMBOLS = [
        Parser.S_LOADING,
        Parser.S_SAVE,
        Parser.S_DELAY,
        Parser.S_DURATION,
        Parser.S_VOLUME,
        Parser.S_CHORD_CONCAT,
        Parser.S_STEP_ADD,
        Parser.S_STEP_SUB,
        Parser.S_PARAMETER_NEXT,
        D_START.S_CHORD,
        D_END.S_CHORD,
        D_START.S_OPTIONS,
        D_END.S_OPTIONS,
    ]

    constructor(prompt: HTMLInputElement, database: Database) {
        this.prompt = prompt;
        this.prompt.addEventListener
            ("keydown",
                ((event: KeyboardEvent) => {
                    this.getOutput(event, this.prompt.value)
                }) as EventListener, true);
        this.database = database;
    }

    getOutput(e: KeyboardEvent, text: string): void {

        if (e.key == "Enter" && text != null && text != "") {
            Parser.SYMBOLS.toString();
            let input = text;
            console.log(e.key);
            console.log(input);

            let s = input.search(Parser.S_LOADING);
            if (s >= 0) {
                console.log(this.loadChordFromDatabase(input, s));
            }
            else {
                let c = new Chord([]) // mock

                s = input.search(Parser.S_SAVE)
                if (s >= 0) {
                    this.saveChordToDatabase(c, input, s);
                }
            }
        }
        // else
        // get chord strings
        // get option strings
        // get save string

    }
    saveChordToDatabase(chord : Chord, input: string, s: number) : void{
        input = input.slice(s, input.length);
        
        if(chord == null) throw "EMPTY CHORD";
        let search = input.search(Parser.S_PARAMETER_NEXT)
        let description = "";
        if(search >= 0){
            description = input.slice(search + 1, input.length).trim();
        }
        else search = input.length;
        
        let name = input.slice(2, search).trim();
        console.log(name);
        console.log(description);

        chord.name = name;
        chord.description = description;
        console.log(chord)
        this.database.addChord(chord);
    }

    loadChordFromDatabase(input: string, s: number): Chord {
        let t = input.slice(s, Parser.S_LOADING.length);
        let i = input.replace(t, "").trim();
        return this.database.getChord(i);
    }

    static parseChord(input: string): Chord {
        let i = 0;
        let f = input.length;
        let c = input;
        let r = new Chord([]);

        while (i < f) {
            i = c.search(this.S_CHORD_CONCAT);
            if (i < 0) i = f;
            r.notes.push(
                this.parseNote(
                    c.slice(0, i).trim()
                )
            );
            c = c.slice(i, f)
        }
        return r;
    }

    static parseNote(input: string): Note {
        input = input.trim();

        let o = Parser.getGroup(input, D_START.S_OPTIONS, D_END.S_OPTIONS)
        let options: Options = this.parseOptions(o);

        input = input.replace(o, "");

        let name = Parser.getNoteName(input);

        input = input.replace(name, "");

        let transpose = Parser.calculateTransposition(input, 0);
        return new Note(name, options, transpose);
    }

    private static getNoteName(input: string) {
        let name = input.slice(
            input.search(/([ABCDEFG][#b][0-9])/g), 3);

        if (name == "")
            name = input.slice(
                input.search(/([ABCDEFG][0-9])/g), 2);
        return name;
    }

    private static calculateTransposition(input: string, transpose: number) {
        for (let i = 0; i < input.length; i++) {
            let arithmeticBuffer = 0;
            let buffer = "";
            try {
                if (input[i] == "+") {
                    arithmeticBuffer = 1;
                    transpose += parseInt(buffer.trim().replace(/[^0-9]/g, "")) * arithmeticBuffer;
                    buffer = "";
                }
                else if (input[i] == "-") {
                    arithmeticBuffer = -1;
                    transpose += parseInt(buffer.trim().replace(/[^0-9]/g, "")) * arithmeticBuffer;
                    buffer = "";
                }
                else
                    buffer += input[i];
                if (i = input.length) {
                    transpose += parseInt(buffer.trim().replace(/[^0-9]/g, "")) * arithmeticBuffer;
                }
            }
            catch (e) {
                alert(e);
            }
        }
        return transpose;
    }

    static getGroup<T>(
        input: string,
        delimiter_start: D_START,
        delimiter_end: D_END)
        : string {

        let x = "";
        console.log(
            `
            ${delimiter_start.toString()} == 
            ${delimiter_end.toString()}
            `)

        if (delimiter_start.toString() == delimiter_end.toString()) {
            let s = input.search(delimiter_start);
            let e = input.search(delimiter_end);
            if (s >= 0 && e > s) {
                x = input.slice(s, e);
            }
        }
        return x;

    }

    static parseOptions(input: string): Options {
        let r = new Options();
        let t = this.getOptionNumberValue(input.search(this.S_DURATION), input);
        let d = this.getOptionNumberValue(input.search(this.S_DELAY), input);
        let v = this.getOptionNumberValue(input.search(this.S_VOLUME), input);

        if (t != "") r.duration = (this.getDuration(t));
        if (d != "") r.delay = (this.getDelay(d));
        if (v != "") r.volume = (this.getVolume(v));

        return r;
    }

    private static getOptionNumberValue(t: number, input: string): string {
        if (t >= 0) {
            let i = input.slice(t, input.length);
            let b = i.search(this.S_PARAMETER_NEXT);

            if (b >= 0) {
                return input.slice(t, b).
                    replace(/([A-Z])/g, "").trim();
            }
            else {
                return input.slice(t, input.length).
                    replace(/([A-Z])/g, "").trim();
            }
        }
    }

    static getDuration(input: string): number {
        return Number.parseFloat(input);
    }

    static getDelay(input: string): number {
        return Number.parseFloat(input);
    }

    static getVolume(input: string): number {
        return Number.parseFloat(input);
    }

    static getGlobals(input: string = null): Options {
        return new Options();
    }

}
