export interface INotify {
    notify(y: Object): this;
    subscribe(x: IObserve): this;
    unsubscribe(x: IObserve): this;
    toNotify : IObserve[];
}

export interface IObserve {
    notifyHandler(y: object);
}
