import { Options, Note, Chord } from "./definitions";
import { Database } from './database';

export class Parser {

    db: Database;
    prompt: HTMLInputElement;

    // symbols start
    static readonly S_LOADING = "<<";
    static readonly S_SAVE = ">>";
    static readonly S_DELAY = "d:";
    static readonly S_DURATION = "t:";
    static readonly S_VOLUME = "v:";
    static readonly S_CHORD_START = "{";
    static readonly S_CHORD_END = "}";
    static readonly S_OPTIONS_START = "(";
    static readonly S_OPTIONS_END = ")";
    static readonly S_CHORD_CONCAT = "^";
    static readonly S_STEP_SUB = "-";
    static readonly S_STEP_ADD = "+";
    static readonly S_PARAMETER_NEXT = ",";
    // symbols stop

    constructor(prompt: HTMLInputElement) {
        this.prompt = prompt;
        this.prompt.addEventListener
            ("keydown",
                ((event: KeyboardEvent) => {
                    this.getOutput(event, this.prompt.value)
                }) as EventListener, true);

    }

    getOutput(e: KeyboardEvent, text: string) {

        if (e.key == "Enter") {
            let input = text;
            console.log(e.key);
            console.log(input);

            let s = input.search(Parser.S_LOADING);
            if (s >= 0) {
                let t = input.slice(s, Parser.S_LOADING.length);
                let i = input.replace(t, "");
            }
            else {

            }
        }
        // else
        // get chord strings
        // get option strings
        // get save string

    }

    static getChord(input: string): Chord {
        let i = 0;
        let f = input.length;
        let c = input;
        let r = new Chord([]);

        // chord groups implementation

        while (i < f) {
            i = c.search(this.S_CHORD_CONCAT);
            if (i < 0) i = f;
            r.notes.push(
                this.getNote(
                    c.slice(0, i).trim()
                )
            );
            c = c.slice(i, f)
        }
        return r;
    }

    static getNote(input: string): Note {
        input = input.trim();

        let s = input.search(this.S_OPTIONS_START);
        let e = input.search(this.S_OPTIONS_END);
        let o = "";
        let options: Options = null;

        if (s >= 0 && e > s) {
            o = input.slice(s, e);
            options = this.getOptions(o);
        }

        input = input.replace(o, "");

        let n = input.slice(
            input.search(/([ABCDEFG][#b][0-9])/g), 3);

        if (n == "") n = input.slice(
            input.search(/([ABCDEFG][0-9])/g), 2);

        input = input.replace(n, "");

        let transpose = 0;

        for (let i = 0; i < input.length; i++) {
            let arithmeticBuffer = 0;
            let buffer = "";
            try {
                if (input[i] == "+") {
                    arithmeticBuffer = 1;
                    transpose += parseInt(buffer.trim().replace(/[^0-9]/g, "")) * arithmeticBuffer;
                    buffer = "";
                }
                else
                    if (input[i] == "-") {
                        arithmeticBuffer = -1;
                        transpose += parseInt(buffer.trim().replace(/[^0-9]/g, "")) * arithmeticBuffer;
                        buffer = "";
                    }
                    else buffer += input[i];
                if (i = input.length) {
                    transpose += parseInt(buffer.trim().replace(/[^0-9]/g, "")) * arithmeticBuffer;
                }
            }
            catch (e) {
                alert(e);
            }
        }

        return new Note(n, options, transpose);
    }

    static getOptions(input: string): Options {
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

    static getDelay(input: string): number{
        return Number.parseFloat(input);
    }

    static getVolume(input: string): number {
        return Number.parseFloat(input);
    }

    static getGlobals(input: string = null): Options {
        return new Options();
    }

}
