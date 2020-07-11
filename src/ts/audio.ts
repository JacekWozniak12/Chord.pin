import { Destination, PolySynth, Synth, Transport, Part } from 'Tone';
import { Note, Chord, Options } from "./definitions";

export class Audio {

    private instrument: PolySynth
    private chord: Chord;
    private options: Options;
    private part: Part;

    constructor() {
        this.setup();
        this.part = new Part();
    }

    setOptions(options : Options){
        return this.options = options;
    }

    updateChord(chord: Chord): Chord {
        return this.chord = chord;
    }

    setChord(chord): Chord {
        return this.chord = chord;
    }

    getChord(): Chord {
        return this.chord;
    }

    addNote(note: Note): Chord {
        this.chord.notes.unshift(note);
        return this.chord;
    }

    deleteNote(note: Note): Chord {
        this.chord.notes = this.chord.notes.filter(x => x.fretboardPosition != note.fretboardPosition);
        return this.chord;
    }

    deleteAllNoteInstances(note: Note): Chord {
        this.chord.notes = this.chord.notes.filter(x => x.name != note.name);
        return this.chord;
    }

    setup(): this {
        this.chord = new Chord([])
        this.instrument = new PolySynth(
            Synth,
            {
                oscillator: {
                    type: 'triangle8'

                }
            }
        ).toDestination();
        return this;
    }

    dispose(): void {
        this.instrument?.dispose();
        this.instrument = null;
    }

    play(chord: Chord = this.chord): void {     
        this.stop();
        this.setup();
        this.part = new Part((x, y) => {
            this.instrument.triggerAttackRelease(
                y.note,
                y.dur,
                x,
                y.volume)
        }, [])
        chord.notes.forEach(e => {
            this.part.add(e.options.delay,
                {
                    note: e.name,
                    dur: e.options.duration,
                    volume: 
                    (e.options.volume) as number * (this.options.volume as number)
                });
        });
        Destination.mute = false;
        this.part.start(0);
        this.part.loop = 0
        Transport.start();
    }

    stop(){
        this.part.stop();
        Destination.mute = true;
        Transport.stop();
        Transport.cancel();
    }
}



