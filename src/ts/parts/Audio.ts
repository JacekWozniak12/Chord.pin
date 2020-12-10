import { Destination, PolySynth, Synth, Transport, Part } from 'Tone';
import { Options } from "../definitions/Options";
import { Chord } from "../definitions/Chord";

export class Audio {

    instrument: PolySynth
    chord: Chord;
    options: Options;
    part: Part;

    constructor() {
        this.setup();
        this.part = new Part();
    }

    setOptions(options: Options): Options { return this.options = options; }
    updateChord(chord: Chord): Chord { return this.chord = chord; }
    setChord(chord): Chord { return this.chord = chord; }
    getChord(): Chord { return this.chord; }

    setup(): this {
        this.chord = new Chord([])
        this.instrument = new PolySynth(
            Synth,
            {
                oscillator: { type: 'triangle8' }
            }).toDestination();
        return this;
    }

    dispose(): void {
        this.instrument?.dispose();
        this.instrument = null;
    }

    play(chord: Chord = this.chord): void {
        let vol = this.options.getVolume();
        this.stop();

        this.part = new Part((x, y) => {
            this.instrument.triggerAttackRelease(y.note, y.dur, x, y.volume);
        }, [])

        chord.notes.variable.forEach(e => {
            e.options = new Options().setValuesOf(e.options);
            this.part.add(e.options.getDelay(),
                {
                    note: e.name,
                    dur: e.options.getDuration(),
                    volume: (e.options.getVolume()) * vol as number
                });
        });
        
        Destination.mute = false;
        this.part.start(0);
        this.part.loop = 0
        Transport.start();
    }

    stop() {
        this.part.stop();
        Destination.mute = true;
        Transport.stop();
        Transport.cancel();
    }
}



