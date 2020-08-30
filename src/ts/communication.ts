import { Options, Chord } from "./definitions";
import { INotify, IObserve } from './interfaces';

export class Main_Chord extends Chord implements INotify, IObserve {

    notifyHandler(y: object) {
        if (y instanceof Chord) {
            this.setValuesOf(y);
            this.notify(this);
        }
    }

    toNotify: IObserve[];

    notify(y: Object): this {
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
            this.notify(this);
        }
    }

    toNotify: IObserve[];

    notify(y: Object): this {
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

export class Main {
    Options: Main_Options;
    Chord: Main_Chord;



    // database - both options / chord
    // settings changer - options 
    // chord prompt - both, update every change 
    // chord fretboard - chord, update every change


}