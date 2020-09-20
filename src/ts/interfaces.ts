export interface INotify {
    notify(): this;
    subscribe(x: Function): this;
    unsubscribe(x: Function): this;
    toNotify : Function[];
}
