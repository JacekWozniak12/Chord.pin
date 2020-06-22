import { Synth, PolySynth} from "Tone";
import { Note, Options, Chord } from "./Definitions";

export class Audio{
    
    private instrument : PolySynth
    private chord : Chord;
    
    constructor(){
        this.Setup();
    }

    Setup(){ 
                 
        this.chord = new Chord([
            new Note("C3", new Options(0.5, 1, 0.2)),
            new Note("C4", new Options(0.5, 1, 0)),
            new Note("A2", new Options(0.1, 2, 2)),
            new Note("A6", new Options(0.1, 2, 2))
        ])  

        this.instrument = new PolySynth(
            8, 
            Synth,
            {
                oscillator: {
                    type: 'triangle8'
                },
                envelope: {
                    attack: 2,
                    decay: 1,
                    sustain: 0.1,
                    release: 1
                }
            });
        this.instrument.toMaster();
    }

    Dispose(){
        this.instrument.dispose();
        this.instrument = null;
    }

    Play(chord : Chord = this.chord){

        chord.notes.forEach(e => {
            this.instrument.triggerAttackRelease
            (
                e.name, 
                e.options.duration, 
                e.options.delay, 
                e.options.volume
                )
        });

        

    }

    Select(notes : Note[]){
        this.chord = notes;
    }
    
}



