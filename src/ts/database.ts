import { Chord, Options } from "./definitions";
import { INotify } from './interfaces';

export class Database implements INotify {

    private chords: Chord[];
    private toNotify: Function[];
    globalOptions: Options;
    storage = localStorage;

    constructor() {
        this.loadFromLocalStorage();
        this.toNotify = new Array();
    }

    loadFromLocalStorage() {
        try {
            this.chords = JSON.parse(localStorage.getItem("ChordPin_Chord")) as Chord[];
            let x = JSON.parse(localStorage.getItem("ChordPin_Options")) as Options;
            this.globalOptions = new Options().setValues(x);
        }
        catch{
            console.log("LOADING FROM LOCAL STORAGE FAILED");
        }
        if (this.chords == undefined || this.globalOptions == null) this.chords = new Array();
        if (this.globalOptions == undefined || this.globalOptions == null) this.globalOptions = new Options();
        return this;
    }

    saveToLocalStorage() {
        let x = this.globalOptions.serialize();
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

    notify() {
        this.toNotify.forEach(x => { x(); });
        return this;
    }

    subscribe(f: Function): this {
        this.toNotify.push(f);
        return this;
    }

    unsubscribe(f: Function) {
        this.toNotify = this.toNotify.filter(y => y.name != f.name)
        return this;
    }

    getChords(): Chord[] {
        return this.chords;
    }

    getChord(name: string): Chord {
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
    }
}