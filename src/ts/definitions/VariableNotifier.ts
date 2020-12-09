import { Notifier } from './Observer';


export class VariableNotifier<T> extends Notifier {

    constructor(value: T) {
        super();
        value = value;
    }

    private _var: T;

    get var(): T {
        return this._var;
    }

    set var(value: T) {
        if (this._var === value)
            return;
        else {
            this._var = value;
            this.notify();
        }
    }
}
