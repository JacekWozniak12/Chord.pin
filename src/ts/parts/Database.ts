import { Chord } from "../definitions/Chord";
import { Notifier } from "../definitions/Observer";
import { Options } from "../definitions/Options";

export class Database {

    readonly CHORD_STORAGE_CHORDS = "chord.pin__chord";
    readonly CHORD_STORAGE_OPTIONS = "chord.pin__options";
    chords : Chord[];
    options : Options;
    loadEvent : Notifier<Chord | Options>;
    saveEvent : Notifier<Chord | Options>;
    storage = localStorage;

    constructor() {
        this.loadEvent = new Notifier<Chord | Options>();
        this.saveEvent = new Notifier<Chord | Options>();
        this.loadFromLocalStorage();
    }

    loadFromLocalStorage() {
        try {
            this.chords = JSON.parse(localStorage.getItem(this.CHORD_STORAGE_CHORDS)) as Chord[];
            this.options = JSON.parse(localStorage.getItem(this.CHORD_STORAGE_OPTIONS)) as Options;
        }
        catch {
            alert("LOADING FROM LOCAL STORAGE FAILED");
        }
        if (this.chords == undefined || this.chords == null) this.chords = new Array();
        if (this.options == undefined || this.options == null) this.options = new Options();
        this.loadEvent.notify();
        return this;
    }

    saveToLocalStorage() {
        this.storage.setItem(this.CHORD_STORAGE_CHORDS, "");
        this.storage.setItem(this.CHORD_STORAGE_OPTIONS, "");
        this.saveEvent.notify();
        return this;
    }
}



