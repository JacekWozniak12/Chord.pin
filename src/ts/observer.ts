export interface INotify {
    notify(): this;
    subscribe(x: Function): this;
    unsubscribe(x: Function): this;
    toNotify: Function[];
}

export class Notifier<T = null> implements INotify {
    
    constructor(){
        this.toNotify = new Array<Function>();
    }

    notify(obj : T = null): this {
        this.toNotify.forEach(element => {
            element();
        });
        return this;
    }

    subscribe(x: Function): this {
        this.toNotify.push(x);
        return this;
    }

    unsubscribe(x: Function): this {
        this.toNotify = this.toNotify.filter(y => y != x);
        return this;
    }

    toNotify: Function[];
}
