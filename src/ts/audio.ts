import { Chord } from "./definitions";
import { PolySynth, FMSynth } from 'tone';

// Wrapper for Tone.js class
export class Audio{
    
    currentChord : Chord;
    instrument: FMSynth;

    setChord(chord: Chord) : void{
        this.currentChord = chord;
    }
    
    play(chord: Chord = this.currentChord) : void{
        let player = new PolySynth(chord.notes.length, this.instrument).toMaster();       
        this.instrument.triggerAttackRelease(chord.notes.map(({name}) => ([name])));
    }

    setup(): Audio{
        this.instrument = 
        new FMSynth(
            {
                oscillator: {
                    type: 'sine5',
                    modulationType: 'sawtooth12',
                    modulationIndex: 2,
                    harmonicity: 3.4
                },
                envelope: {
                    attack: 0.001,
                    decay: 0.1,
                    sustain: 0.1,
                    release: 0.1
                }
            }
        )
        .toMaster();
        return this;
    }

    dispose(){
        this.instrument.dispose();

    }

}

