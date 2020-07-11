export interface INotify{
    notify(y : Object): this;
    subscribe(x : Function): this;
    unsubscribe(x : Function) : this;
}

export interface IObserve{
    notifyHandler(y: object);
}
