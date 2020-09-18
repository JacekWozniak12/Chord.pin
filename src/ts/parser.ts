import { Options, Note, Chord } from "./definitions";
import { Database } from './database';
import { INotify, IObserve } from './interfaces';

// Delimiters
enum D_START {
    S_CHORD = "{",
    S_OPTIONS = "("
}
enum D_END {
    S_CHORD = "}",
    S_OPTIONS = ")"
}

export class Parser implements INotify {

    database: Database;
    prompt: HTMLInputElement;
    chord: Chord;
    options: Options;

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

    constructor(prompt: HTMLInputElement, database: Database) {
        this.prompt = prompt;
        this.prompt.addEventListener
            ("keydown",
                ((event: KeyboardEvent) => {
                    this.getOutput(event, this.prompt.value)
                }) as EventListener, true);
        this.database = database;
        this.toNotify = new Array<IObserve>();
    }

    getOutput(e: KeyboardEvent, input: string): void {

        let save = false;

        if (e.key == "Enter" && input != null && input != "") {
            let isFinished = this.HandleLoadProcedure(input);
            if (isFinished) return;
            else {
                let globalSettings = false;
                let search = input.indexOf(Parser.S_SAVE);
                let NameDescriptionPart = "";

                if (search >= 2) {
                    NameDescriptionPart = input.slice(search + Parser.S_SAVE.length, input.length);
                    input = input.slice(0, search + 1).replace(">", "");
                }

                input = input.toUpperCase();

                let chords: Chord[] = new Array();
                search = input.indexOf(D_START.S_CHORD);

                let settings = this.database.getOptions();
                while (search != -1) {
                    let t = Parser.getGroup(input, D_START.S_CHORD, D_END.S_CHORD);
                    input = input.replace(t, "");

                    search = input.indexOf(D_START.S_CHORD);
                    let o = input.indexOf(D_START.S_OPTIONS);

                    if (o < search) {
                        let r = Parser.getGroup(input, D_START.S_OPTIONS, D_END.S_OPTIONS);
                        input = input.replace(r, "");
                        settings = Parser.getOptions(r, settings);
                    }
                    chords.unshift(Parser.parseChord(t, settings));
                    console.log(chords);
                }

                search = input.indexOf(D_START.S_OPTIONS);
                if (search > -1) {
                    let t = Parser.getGroup(input, D_START.S_OPTIONS, D_END.S_OPTIONS);
                    input = input.replace(t, "");
                    settings = Parser.getOptions(t);
                    globalSettings = true;
                }

                let chord = Parser.parseChord(input, settings);
                chords.forEach(element => {
                    chord.addChord(element);
                });

                if (NameDescriptionPart.length > 0) {
                    this.saveChordToDatabase(chord, NameDescriptionPart)
                }

                if (chord.notes.length > 0) {
                    this.notifySubscribersWith(chord);
                }

                else if (globalSettings) {
                    this.database.setOptions(settings);
                    this.notifySubscribersWith(settings);
                }
            }
        }
    }

    static parseChord(input: string, def: Options): Chord {
        let i = 0;
        let c = Parser.clearGroups(input, D_START.S_CHORD, D_END.S_CHORD);
        let f = c.length;
        let r = new Chord([]);

        while (i < f) {
            i = c.indexOf(this.S_CHORD_CONCAT);
            if (i < 2) i = f;
            let t = c.slice(0, i).replace(this.S_CHORD_CONCAT, "");
            if (t.trim() != "")
                r.notes.push(
                    this.parseNote(
                        t, def
                    )
                );
            c = c.slice(i + 1, f)
        }
        return r;
    }

    static clearGroups(input: string, s: string, e: string) {
        input = input.replace(s, "").replace(e, "");
        return input;
    }

    static parseNote(input: string, def: Options): Note {

        let o = Parser.getGroup(input, D_START.S_OPTIONS, D_END.S_OPTIONS);
        let options = this.getOptions(o, def);
        input = input.replace(o, "");

        let name = Parser.getNoteName(input);
        input = input.replace(name, "").replace(D_START.S_CHORD, "").replace(D_END.S_CHORD, "");

        let transpose = Parser.calculateTransposition(input, 0);
        return new Note(name, options, -1, transpose);
    }

    private HandleLoadProcedure(input: string): boolean {
        let search = input.indexOf(Parser.S_LOADING);

        if (search >= 0) {
            this.chord = this.loadChordFromDatabase(input, search);
            return true;
        }
        return false;
    }

    saveChordToDatabase(chord: Chord, input: string): void {

        if (chord == null || chord.notes.length < 1) throw "EMPTY CHORD";
        let search = input.search(Parser.S_PARAMETER_NEXT)
        let description = "";

        if (search >= 0) {
            description = input.slice(search + 1, input.length).trim();
        }
        else search = input.length;

        let name = input.slice(2, search).trim();
        chord.name = name;
        chord.description = description;
        this.database.addChord(chord);
    }

    loadChordFromDatabase(input: string, s: number): Chord {
        let t = input.slice(s, Parser.S_LOADING.length);
        let i = input.replace(t, "").trim();
        return this.database.getChord(i);
    }

    static getGroup(input: string, delimiter_start: D_START, delimiter_end: D_END): string {
        let x = "";
        let s = input.indexOf(delimiter_start);
        let e = input.indexOf(delimiter_end);
        if (s == -1) {
            s = 0;
            if (e == -1) {
                return "";
            }
            else e = input.length;
        }
        else if (e == -1) {
            e = input.length;
        }
        x = input.slice(s, e + 1);
        return x;
    }

    private static getNoteName(input: string) {
        input = input.toUpperCase();
        let name = input.slice(
            input.search(/([ABCDEFG])/g), input.search(/[0-9]/g) + 1);
        return name;
    }

    private static calculateTransposition(input: string, transpose: number) {
        input = input.trim();
        if (input.length > 0) {
            let arithmeticBuffer = 0;
            let buffer = "";
            for (let i = 0; i < input.length; i++) {
                try {
                    if (input[i] == "+") {
                        arithmeticBuffer = 1;
                        if (buffer != "") {
                            transpose += parseInt(buffer.trim().replace(/[^0-9]/g, "")) * arithmeticBuffer;
                            buffer = "";
                        }
                    }
                    else if (input[i] == "-") {
                        arithmeticBuffer = -1;
                        if (buffer != "") {
                            transpose += parseInt(buffer.trim().replace(/[^0-9]/g, "")) * arithmeticBuffer;
                            buffer = "";
                        }
                    }
                    else {
                        buffer += input[i];
                        buffer.trim();
                    }
                    if (i == input.length - 1) {
                        transpose += parseInt(buffer.trim().replace(/[^0-9]/g, "")) * arithmeticBuffer;
                    }
                }
                catch (e) {
                    alert(e);
                }
            }
        }
        return transpose;
    }

    static getOptions(input: string, def: Options = new Options()): Options {
        input = input.toLowerCase();
        let result = def;
        let t = this.getOptionNumberValue(this.S_DURATION, input);
        let d = this.getOptionNumberValue(this.S_DELAY, input);
        let v = this.getOptionNumberValue(this.S_VOLUME, input);

        if (t != "" && t != null) result.duration = (this.getDuration(t));
        if (d != "" && d != null) result.delay = (this.getDelay(d));
        if (v != "" && v != null) result.volume = (this.getVolume(v));
        return result;
    }

    private static getOptionNumberValue(symbol: string, input: string): string {
        let t = input.indexOf(symbol);
        if (t >= 0) {
            let i = input.slice(t, input.length);
            let b = i.search(this.S_PARAMETER_NEXT);

            if (b >= 0) {
                let r = input.slice(t + symbol.length - 1, b).replace(/([^0-9.])/g, "").trim();
                return r;
            }
            else {
                let r = input.slice(t + symbol.length - 1, input.length).replace(/([^0-9.])/g, "").trim();
                return r;
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

    toNotify: IObserve[];

    notifySubscribersWith(y: Object = null) {
        this.toNotify.forEach(x => x.notifyHandler(y));
        return this;
    }

    subscribe(x: IObserve) {
        this.toNotify.push(x);
        return this;
    }

    unsubscribe(x: IObserve) {
        this.toNotify = this.toNotify.filter(y => y != x)
        return this;
    }

}
