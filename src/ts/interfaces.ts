export interface INotify{
    notify(y : Object): this;
    subscribe(x : Function): this;
    unsubscribe(x : Function) : this;
}

export interface IErrorHandler{
    HandleError() : this;
}