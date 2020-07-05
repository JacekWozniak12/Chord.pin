import { Chord, Options } from "./definitions";

export class Database {

    private chords: Chord[];
    private globalOptions: Options;
    storage = localStorage;
    toNotifyChordChange: Function[];

    constructor() {
        this.toNotifyChordChange = new Array();
        this.loadFromLocalStorage();
    }

    loadFromLocalStorage() {
        try {
            this.chords = JSON.parse(localStorage.getItem("ChordPin_Chord")) as Chord[];
            this.globalOptions = JSON.parse(localStorage.getItem("ChordPin_Options")) as Options;
        }
        catch{
            console.log("LOADING FROM LOCAL STORAGE FAILED");
        }
        if (this.chords == undefined) this.chords = new Array();
        if (this.globalOptions == undefined) this.globalOptions = new Options();
        return this;
    }

    // this.chords.forEach(x => {
    //     if(x.name == null) this.chords = this.chords.filter(y => y.name != x.name);
    // })

    saveToLocalStorage() {
        try {
            this.storage.setItem("ChordPin_Chord", JSON.stringify(this.chords));
            this.storage.setItem("ChordPin_Options", JSON.stringify(this.globalOptions));
        }
        catch{
            console.log("SAVING TO LOCAL STORAGE FAILED");
        }
        return this;
    }

    setChords(chords: Chord[]): this {
        this.chords = chords;
        this.notify();
        return this;
    }

    addChord(chord: Chord): this {
        if (this.chords.find(x => x.name == chord.name) == null)
            this.chords.push(chord);
        this.notify();
        this.saveToLocalStorage();
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
        return this.chords.find(x => x.name == name);
    }

    setOptions(options: Options): this {
        this.globalOptions = options;
        return this;
    }

    getOptions(): Options {
        return this.globalOptions;
    }

    clear() {
        this.chords = new Array();
        this.globalOptions = new Options();
        this.notify();
        this.saveToLocalStorage();
    }
}