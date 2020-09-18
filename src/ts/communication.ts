import { Options, Chord } from "./definitions";
import { INotify, IObserve } from './interfaces';
import { Database } from './database';

// database - both options / chord
// settings changer - options 
// chord prompt - both, update every change 
// chord fretboard - chord, update every change

export class Main {
    options: Main_Options;
    chord: Main_Chord;
    database: Database;

    constructor() {
        this.database = new Database();
        this.chord = this.database.getChord() as Main_Chord;
        this.options = this.database.getOptions() as Main_Options;
    }

    subscribeToOptions(o: object) {
        let subscriber = o as IObserve;
        this.options.subscribe(subscriber);
    }

    subscribeToChord(o: object) {
        let subscriber = o as IObserve;
        this.chord.subscribe(subscriber);
    }

    unsubscribe(o: object) {
        let subscriber = o as IObserve;
        this.chord.unsubscribe(subscriber);
        this.options.unsubscribe(subscriber);
    }
}

export class Main_Chord extends Chord implements INotify, IObserve {

    notifyHandler(y: object) {
        if (y instanceof Chord) {
            this.setValuesOf(y);
            this.notifySubscribersWith(this);
        }
    }

    toNotify: IObserve[] = new Array<IObserve>();

    notifySubscribersWith(y: Object): this {
        if (y instanceof Chord) {
            this.toNotify.forEach(x => x.notifyHandler(y));
        }
        return this;
    }
    subscribe(x: IObserve): this {
        this.toNotify.push(x);
        return this;
    }
    unsubscribe(x: IObserve): this {
        this.toNotify = this.toNotify.filter(y => x == y);
        return this;
    }
}

export class Main_Options extends Options implements INotify, IObserve {

    notifyHandler(y: object) {
        if (y instanceof Options) {
            this.setValuesOf(y);
            this.notifySubscribersWith(this);
        }
    }

    toNotify: IObserve[] = new Array<IObserve>();

    notifySubscribersWith(y: Object): this {
        if (y instanceof Options) {
            this.toNotify.forEach(x => x.notifyHandler(y));
        }
        return this;
    }
    subscribe(x: IObserve): this {
        this.toNotify.push(x);
        return this;
    }
    unsubscribe(x: IObserve): this {
        this.toNotify = this.toNotify.filter(y => x == y);
        return this;
    }
}

