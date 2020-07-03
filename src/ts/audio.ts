import { PolySynth, Synth, Transport, Part } from 'Tone';
import { Note, Chord } from "./Definitions";

export class Audio {

    private instrument: PolySynth
    private chord: Chord;

    constructor() {
        this.setup();
    }

    updateChord(chord: Chord) {
        this.chord = chord;
    }

    addNote(note: Note) {
        this.chord.notes.unshift(note);
    }

    deleteNote(note: Note) {
        this.chord.notes = this.chord.notes.filter(x => x.name != note.name);
    }

    setup() {

        this.chord = new Chord([])

        this.instrument = new PolySynth(
            Synth
            // {
            //     oscillator: {
            //         type: 'triangle8'
            //     },
            //     envelope: {
            //         attack: 1.22,
            //         decay: 1,
            //         sustain: 0.1,
            //         release: 1
            //     }
            // }
        ).toDestination();
    }

    dispose() {
        this.instrument.dispose();
        this.instrument = null;
    }

    play(chord: Chord = this.chord) {
        Transport.stop();
        Transport.cancel();

        let temp = this.instrument;

        let part = new Part(function (time, event) {
            temp.triggerAttackRelease(
                event.note,
                event.dur,
                time,
                event.volume)
        }, []
        )

        chord.notes.forEach(e => {
            part.add(e.options.delay,
                {
                    note: e.name,
                    dur: e.options.duration,
                    volume: e.options.volume
                });
        });

        console.log(part);

        part.start(0);
        part.loop = 0

        Transport.start();
    }
}



