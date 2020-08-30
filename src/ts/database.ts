import { Chord, Options } from "./definitions";
import { INotify, IObserve } from './interfaces';

export class Database {

    readonly CHORD_STORAGE_CHORDS = "chord.pin__chord";
    readonly CHORD_STORAGE_OPTIONS = "chord.pin__options";
    storage = localStorage;
    chords: Database_Chords = new Database_Chords();
    options: Database_Options = new Database_Options();

    constructor() {
        this.loadFromLocalStorage();
    }

    toNotify: IObserve[];

    loadFromLocalStorage() {
        try {
            this.chords.items = JSON.parse(localStorage.getItem(this.CHORD_STORAGE_CHORDS)) as Chord[];
            this.options.item = new Options().setValuesOf(JSON.parse(localStorage.getItem(this.CHORD_STORAGE_OPTIONS)) as Options);
        }
        catch {
            console.log("LOADING FROM LOCAL STORAGE FAILED");
            alert("FAIL");
        }
        if (this.chords.items == undefined || this.chords.items == null) this.chords.items = new Array();
        if (this.options.item == undefined || this.options.item == null) this.options.item = new Options();
        return this;
    }

    saveToLocalStorage() {
        this.storage.setItem(this.CHORD_STORAGE_CHORDS, JSON.stringify(this.chords));
        this.storage.setItem(this.CHORD_STORAGE_OPTIONS, this.options.item.serialize());
        return this;
    }

    clear() {
        this.chords.items = new Array();
        this.options.item = new Options();
        this.notifyAllSubscribers();
        this.saveToLocalStorage();
    }

    private notifyAllSubscribers() {
        this.chords.notifySubscribersWith();
        this.options.notifySubscribersWith();
    }

    addChord(chord: Chord): this {
        this.chords.addChord(chord);
        this.chords.notifySubscribersWith();
        return this;
    }

    deleteChord(name: string): this {
        this.chords.deleteChord(name);
        this.chords.notifySubscribersWith();
        return this;
    }

    setOptions(options: Options): this {
        this.options.setOptions(options);
        this.options.notifySubscribersWith();
        return this;
    }

    getChord(name: string = null): Chord {
        return this.chords.items.find(y => y.name != name) ?? this.chords.items[0] ?? null;
    }
    
    getChords(): Chord[] {
        return this.chords.items;
    }
    
    getOptions(): Options {
        return this.options.item;
    }
    
    subscribeToChordChanges(x: IObserve) {
        this.chords.subscribe(x);
    }
   
    subscribeToOptionsChanges(x: IObserve) {
        this.options.subscribe(x);
    }

}

export class Database_Chords implements INotify {

    notifySubscribersWith(y: Object = this.items): this {
        this.toNotify.forEach(x => {
            if(x instanceof Function) x(y);
            else x.notifyHandler(y);
        });
        return this;
    }

    toNotify: IObserve[] = new Array<IObserve>();
    items: Chord[] = new Array<Chord>();

    subscribe(x: IObserve): this {
        this.toNotify.push(x);
        return this;
    }

    unsubscribe(x: IObserve) {
        this.toNotify = this.toNotify.filter(y => y != x)
        return this;
    }

    addChord(chord: Chord): this {
        if (this.items.find(x => x.name == chord.name || x.notes == chord.notes) == null)
            this.items.push(chord);
        this.notifySubscribersWith(this.items);
        return this;
    }

    deleteChord(name: string): this {
        this.items = this.items.filter(y => y.name != name);
        this.notifySubscribersWith(this.items);
        return this;
    }
}

export class Database_Options implements INotify {

    notifySubscribersWith(y: Object = this.item): this {
        this.toNotify.forEach(x => x.notifyHandler(y));
        return this;
    }
    subscribe(x: IObserve): this {
        this.toNotify.push(x);
        return this;
    }
    unsubscribe(x: IObserve) {
        this.toNotify = this.toNotify.filter(y => y != x)
        return this;
    }

    toNotify: IObserve[] = new Array<IObserve>();
    item: Options = new Options();

    setOptions(options: Options): this {
        this.item = options;
        this.notifySubscribersWith(this.item);
        return this;
    }
}