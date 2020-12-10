import { Library } from '../Library';
import { MAX_VOLUME, MAX_DELAY, MAX_DURATION } from './Const';
import { VariableNotifier } from './Observer';


export class Options {

    constructor(
        volume: string | number = 0.5, duration: string | number = 1, delay: string | number = 0
    ) {
        try {
            this.volume = new VariableNotifier(Library.clamp(Number.parseFloat(volume as string), 0, MAX_VOLUME));
            this.delay = new VariableNotifier(Library.clamp(Number.parseFloat(delay as string), 0, MAX_DELAY));
            this.duration = new VariableNotifier(Library.clamp(Number.parseFloat(duration as string), 0, MAX_DURATION));
        }
        catch (e) {
            this.volume = new VariableNotifier(1);
            this.delay = new VariableNotifier(0);
            this.duration = new VariableNotifier(0.5);
            console.log(e + "\nWriting default options");
        }
    }

    getVolume(): number {
        return this.volume.variable;
    }

    getDelay(): number {
        return this.delay.variable;
    }

    getDuration(): number {
        return this.duration.variable;
    }

    setVolume(value: string | number) {
        this.volume.variable = Library.clamp(Number.parseFloat(value as string), 0, MAX_VOLUME);
        return this;
    }

    setDelay(value: string | number) {
        this.delay.variable = Library.clamp(Number.parseFloat(value as string), 0, MAX_DELAY);
        return this;
    }

    setDuration(value: string | number) {
        this.duration.variable = Library.clamp(Number.parseFloat(value as string), 0, MAX_DURATION);
        return this;
    }

    setValuesOf(options: Options) {
        this.setVolume(options.volume.variable);
        this.setDelay(options.delay.variable);
        this.setDuration(options.duration.variable);
        return this;
    }

    private duration: VariableNotifier<number>;
    private delay: VariableNotifier<number>;
    private volume: VariableNotifier<number>;

}
