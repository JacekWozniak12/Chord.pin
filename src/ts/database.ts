import { Chord, Options } from "./definitions";
import { INotify, IObserve } from './interfaces';

export class Database {

    storage = localStorage;

    

    constructor() {
        this.loadFromLocalStorage();
    }

    loadFromLocalStorage() {
        try {
            this.chords = JSON.parse(localStorage.getItem("ChordPin_Chord")) as Chord[];
            let x = JSON.parse(localStorage.getItem("ChordPin_Options")) as Options;
            this.globalOptions = new Options().setValuesOf(x);
        }
        catch {
            console.log("LOADING FROM LOCAL STORAGE FAILED");
            alert("FAIL");
        }
        if (this.chords == undefined || this.globalOptions == null) this.chords = new Array();
        if (this.globalOptions == undefined || this.globalOptions == null) this.globalOptions = new Options();
        return this;
    }

    saveToLocalStorage() {
        this.storage.setItem("ChordPin_Chord", JSON.stringify(this.chords));
        this.storage.setItem("ChordPin_Options", this.globalOptions.serialize());
        return this;
    }

    clear() {
        this.chords = new Array();
        this.globalOptions = new Options();
        this.saveToLocalStorage();
    }
}

export class Database_Chords implements INotify {

    toNotify: IObserve[];

    subscribe(x: IObserve): this {
        this.toNotify.push(x);
        return this;
    }

    unsubscribe(x: IObserve) {
        this.toNotify = this.toNotify.filter(y => y != x)
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

    getChords(): Chord[] { return this.chords; }
    getChord(name: string): Chord { return this.chords.find(x => x.name === name); }

}

export class Database_Options implements INotify {

    toNotify: IObserve[];

    getOptions(): Options { return this.globalOptions; }

    setOptions(options: Options): this {
        this.globalOptions = options;
        this.saveToLocalStorage();
        return this;
    }
}