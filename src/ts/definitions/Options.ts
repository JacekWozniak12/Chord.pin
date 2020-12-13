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
        this.volume.subscribe(x => this.setVolume(this.volume.variable));
        this.delay.subscribe(x => this.setDelay(this.delay.variable));
        this.duration.subscribe(x => this.setDuration(this.duration.variable));
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

    duration: VariableNotifier<number>;
    delay: VariableNotifier<number>;
    volume: VariableNotifier<number>;

}
