export interface INotify {
    notifySubscribersWith(y: Object): this;
    subscribe(x: IObserve): this;
    unsubscribe(x: IObserve): this;
    toNotify : IObserve[];
}

export interface IObserve {
    notifyHandler(y: object);
}
