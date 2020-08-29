import { Options, Chord } from "./definitions";
import { INotify, IObserve } from './interfaces';

export class Main_Chord extends Chord implements INotify, IObserve{
    
    notifyHandler(y: object) {
        throw new Error("Method not implemented.");
    }

    toNotify: IObserve[];

    notify(y: Object): this {
        throw new Error("Method not implemented.");
    }
    subscribe(x: Function): this {
        throw new Error("Method not implemented.");
    }
    unsubscribe(x: Function): this {
        throw new Error("Method not implemented.");
    }
}

export class Main_Options extends Options implements INotify, IObserve{
    
    notifyHandler(y: object) {
        throw new Error("Method not implemented.");
    }

    toNotify: IObserve[];

    notify(y: Object): this {
        throw new Error("Method not implemented.");
    }
    subscribe(x: Function): this {
        throw new Error("Method not implemented.");
    }
    unsubscribe(x: Function): this {
        throw new Error("Method not implemented.");
    }
}