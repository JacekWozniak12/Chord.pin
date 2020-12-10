import { Options } from "../Definitions/Options";
import { Chord } from "../Definitions/Chord";
import { Note } from "../Definitions/Note";
import { Main } from './Communication';
import { Notifier } from '../Definitions/Observer';
import { D_END, D_START, S_PARSER_CHORD_CONCAT, S_PARSER_DELAY, S_PARSER_DURATION, S_PARSER_LOADING, S_PARSER_PARAMETER_NEXT, S_PARSER_SAVE, S_PARSER_VOLUME } from "../definitions/Const";

export class Parser {

    current: Main;
    prompt: HTMLInputElement;

    parseEvent: Notifier<Chord | Options>
    saveEvent: Notifier<Chord | Options>;
    loadEvent: Notifier<Chord | Options>;

    main: Main;

    constructor(prompt: HTMLInputElement) {
        this.prompt = prompt;
        this.prompt.addEventListener
            ("keydown",
                ((event: KeyboardEvent) => {
                    this.getOutput(event, this.prompt.value)
                }) as EventListener, true);

        this.loadEvent = new Notifier<Chord | Options>();
        this.saveEvent = new Notifier<Chord | Options>();
        this.parseEvent = new Notifier<Chord | Options>();
    }

    getOutput(e: KeyboardEvent, input: string): void {

        let save = false;

        if (e.key == "Enter" && input != null && input != "") {
            let isFinished = this.HandleLoadProcedure(input);
            if (isFinished) return;
            else {
                let globalSettings = false;
                let search = input.indexOf(S_PARSER_SAVE);
                let nameDescriptionPart = "";

                if (search >= 2) {
                    nameDescriptionPart = input.slice(search + S_PARSER_SAVE.length, input.length);
                    input = input.slice(0, search + 1).replace(">", "");
                }

                input = input.toUpperCase();

                let chords: Chord[] = new Array();
                search = input.indexOf(D_START.S_CHORD);

                let settings = this.main.options;
                while (search != -1) {
                    let part = Parser.getGroup(input, D_START.S_CHORD, D_END.S_CHORD);
                    input = input.replace(part, "");

                    search = input.indexOf(D_START.S_CHORD);
                    let o = input.indexOf(D_START.S_OPTIONS);

                    if (o < search) {
                        let r = Parser.getGroup(input, D_START.S_OPTIONS, D_END.S_OPTIONS);
                        input = input.replace(r, "");
                        settings = Parser.getOptions(r, settings);
                    }
                    chords.unshift(Parser.parseChord(part, settings));
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

                if (nameDescriptionPart.length > 0) {
                    this.saveChord(chord, nameDescriptionPart)
                }

                if (chord.notes.var.length > 0) {
                }

                else if (globalSettings) {
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
            i = c.indexOf(S_PARSER_CHORD_CONCAT);
            if (i < 2) i = f;
            let t = c.slice(0, i).replace(S_PARSER_CHORD_CONCAT, "");
            if (t.trim() != "")
                r.notes.var.push(
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
        return new Note(name, transpose, options);
    }

    private HandleLoadProcedure(input: string): boolean {
        let search = input.indexOf(S_PARSER_LOADING);

        if (search >= 0) {
            this.loadEvent.notify(this.loadChord(input, search));
            return true;
        }
        return false;
    }

    saveChord(chord: Chord, input: string): void {

        if (chord == null || chord.notes.var.length < 1) throw "EMPTY CHORD";
        let search = input.search(S_PARSER_PARAMETER_NEXT)
        let description = "";

        if (search >= 0) {
            description = input.slice(search + 1, input.length).trim();
        }
        else search = input.length;

        let name = input.slice(2, search).trim();
        chord.name.var = name;
        chord.description.var = description;
        this.saveEvent.notify(chord);
    }

    loadChord(input: string, s: number): Chord {
        let t = input.slice(s, S_PARSER_LOADING.length);
        let i = input.replace(t, "").trim();
        return this.main.getChord(i);
    }

    static getGroup(input: string, delimiter_start: D_START, delimiter_end: D_END): string {
        let part = "";
        let startIndex = input.indexOf(delimiter_start);
        let endIndex = input.indexOf(delimiter_end);
        if (startIndex == -1) {
            startIndex = 0;
            if (endIndex == -1) {
                return "";
            }
            else endIndex = input.length;
        }
        else if (endIndex == -1) {
            endIndex = input.length;
        }
        part = input.slice(startIndex, endIndex + 1);
        return part;
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
                catch (error) {
                    alert(error);
                }
            }
        }
        return transpose;
    }

    static getOptions(input: string, def: Options = new Options()): Options {
        input = input.toLowerCase();

        let result = def;

        let duration = this.getOptionNumberValue(S_PARSER_DURATION, input);
        let delay = this.getOptionNumberValue(S_PARSER_DELAY, input);
        let volume = this.getOptionNumberValue(S_PARSER_VOLUME, input);

        if (duration != "" && duration != null) result.setDuration(this.getDuration(duration));
        if (delay != "" && delay != null) result.setDelay(this.getDelay(delay));
        if (volume != "" && volume != null) result.setVolume(this.getVolume(volume));

        return result;
    }

    private static getOptionNumberValue(symbol: string, input: string): string {
        let startIndex = input.indexOf(symbol);
        if (startIndex >= 0) {
            let part = input.slice(startIndex, input.length);
            let endIndex = part.search(S_PARSER_PARAMETER_NEXT);

            if (endIndex >= 0) {
                return input.slice(startIndex + symbol.length - 1, endIndex).replace(/([^0-9.])/g, "").trim();
            }
            else {
                return input.slice(startIndex + symbol.length - 1, input.length).replace(/([^0-9.])/g, "").trim();
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
}
