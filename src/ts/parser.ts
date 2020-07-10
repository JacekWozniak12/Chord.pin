import { Options, Note, Chord } from "./definitions";
import { Database } from './database';
import { Components } from './components';

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
    fretboard: Components.Interfaces.Fretboard;
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

    constructor(prompt: HTMLInputElement, database: Database, fretboard : Components.Interfaces.Fretboard) {
        this.prompt = prompt;
        this.prompt.addEventListener
            ("keydown",
                ((event: KeyboardEvent) => {
                    this.getOutput(event, this.prompt.value)
                }) as EventListener, true);
        this.database = database;
        this.fretboard = fretboard;
    }

    getOutput(e: KeyboardEvent, input: string): void {

        let save = false;

        if (e.key == "Enter" && input != null && input != "") {
            let isFinished = this.HandleLoadProcedure(input);
            if (isFinished) return;
            else {
                // { ( ) }( ) >> name, description

                let search = input.indexOf(Parser.S_SAVE);
                let NameDescriptionPart = "";
                while(search < 2 && search != -1)
                {
                    if(search >= 2){
                        NameDescriptionPart = input.slice(search, input.length);
                        input = input.slice(0, search);
                    }
                }

                let chords : Chord[] = new Array();
                search = input.indexOf(D_START.S_CHORD);

                let settings = new Options();
                while(search != -1){
                    let t = Parser.getGroup(input, D_START.S_CHORD, D_END.S_CHORD);
                    input.replace(t, "");

                    search = input.indexOf(D_START.S_CHORD);
                    let o = input.indexOf(D_START.S_OPTIONS);
                    
                    if(o < search){
                        let r = Parser.getGroup(input, D_START.S_OPTIONS, D_END.S_OPTIONS);
                        input = input.replace(r, "");
                        settings = Parser.parseOptions(r, settings);
                    }
                    chords.unshift(Parser.parseChord(t, settings));                 
                }
                
                search = input.indexOf(D_START.S_OPTIONS);
                if(search > -1){
                    let t = Parser.getGroup(input, D_START.S_OPTIONS, D_END.S_OPTIONS);
                    input = input.replace(t, "");
                    settings = Parser.parseOptions(t);
                }

                let chord = Parser.parseChord(input, settings);
                chords.forEach(element => {
                    chord.addChord(element);
                });

                if(NameDescriptionPart != ""){
                    this.saveChordToDatabase(chord, NameDescriptionPart)
                }
                
                this.fretboard.selectChord(chord);
            }
        }
    }

    static parseChord(input: string, def: Options): Chord {
        let i = 0;
        let c = input;
        let f = c.length;
        let r = new Chord([]);

        while (i < f) {
            i = c.indexOf(this.S_CHORD_CONCAT);
            if (i < 2) i = f;
            let t = c.slice(0, i).replace(this.S_CHORD_CONCAT, "");
            r.notes.push(
                this.parseNote(
                    t, def
                )
            );
            c = c.slice(i + 1, f)
        }
        return r;
    }

    static parseNote(input: string, def: Options): Note {

        let o = Parser.getGroup(input, D_START.S_OPTIONS, D_END.S_OPTIONS);
        let options = this.parseOptions(o, def);
        input = input.replace(o, "");

        let name = Parser.getNoteName(input);
        input = input.replace(name, "");

        let transpose = Parser.calculateTransposition(input, 0);
        return new Note(name, options, -1, transpose);
    }

    private HandleLoadProcedure(input: string): boolean {
        let search = input.indexOf(Parser.S_LOADING);
        // load from database
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
        if (s >= 0 && e > s) {
            x = input.slice(s + 1, e + 1);
        }
        return x;
    }

    private static getNoteName(input: string) {
        let name = input.substring(
            input.search(/([ABCDEFG][#b][0-9])/g) - 1, 3);

        if (name == "")
            name = input.substring(
                input.search(/([ABCDEFG][0-9])/g) - 1, 2);
        return name;
    }

    private static calculateTransposition(input: string, transpose: number) {

        input = input.trim();
        if(input.length > 0){
            let arithmeticBuffer = 0;
            let buffer = "";
            for (let i = 0; i < input.length; i++) {
                try {
                    if (input[i] == "+") {
                        arithmeticBuffer = 1;
                        if(buffer != ""){
                            transpose += parseInt(buffer.trim().replace(/[^0-9]/g, "")) * arithmeticBuffer;
                            buffer = "";
                        }                          
                    }
                    else if (input[i] == "-") {
                        arithmeticBuffer = -1;
                        if(buffer != ""){
                            transpose += parseInt(buffer.trim().replace(/[^0-9]/g, "")) * arithmeticBuffer;
                            buffer = "";
                        }   
                    }
                    else{
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

    static parseOptions(input: string, def: Options = new Options()): Options {
        let r = def;
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
                return input.slice(t, b).replace(/([A-Z])/g, "").trim();
            }
            else {
                return input.slice(t, input.length).replace(/([A-Z])/g, "").trim();
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
