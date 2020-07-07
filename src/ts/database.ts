import { Chord, Options } from "./definitions";

export class Database {

    private chords: Chord[];
    globalOptions: Options;
    storage = localStorage;

    private toNotifyChordChange: Function[];

    getNotified(f: Function): void {
        this.toNotifyChordChange.push(f);
    }

    constructor() {
        this.loadFromLocalStorage();
        this.toNotifyChordChange = new Array();
    }

    loadFromLocalStorage() {
        try {
            this.chords = JSON.parse(localStorage.getItem("ChordPin_Chord")) as Chord[];
            let x = JSON.parse(localStorage.getItem("ChordPin_Options")) as Options;
            this.globalOptions = new Options().setValues(x);
            console.log(this.globalOptions);
        }
        catch{
            console.log("LOADING FROM LOCAL STORAGE FAILED");
        }
        if (this.chords == undefined || this.globalOptions == null) this.chords = new Array();
        if (this.globalOptions == undefined || this.globalOptions == null) this.globalOptions = new Options();
        return this;
    }

    saveToLocalStorage() {
            let x = (<Options>this.globalOptions).serialize();
            this.storage.setItem("ChordPin_Chord", JSON.stringify(this.chords));
            this.storage.setItem("ChordPin_Options", x);

        return this;
    }

    addChord(chord: Chord): this {
        if (this.chords.find(x => x.name == chord.name || x.notes == chord.notes) == null)
            this.chords.push(chord);
        this.saveToLocalStorage();
        this.notify();
        return this;
    }

    deleteChord(name: string): this {
        this.chords = this.chords.filter(y => y.name != name);
        this.saveToLocalStorage();
        this.notify();
        return this;
    }

    private notify() {
        this.toNotifyChordChange.forEach(
            x => {
                x();
            }
        );
    }

    getChords(): Chord[] {
        return this.chords;
    }

    getChord(name: string): Chord {
        console.log(`GETTING ${name}`);
        return this.chords.find(x => x.name === name);
    }

    setOptions(options: Options): this {
        this.globalOptions = options;
        this.saveToLocalStorage();
        return this;
    }

    getOptions(): Options {
        return this.globalOptions;
    }

    clear() {
        this.chords = new Array();
        this.globalOptions = new Options();   
        this.saveToLocalStorage();
        this.notify();
    }
}