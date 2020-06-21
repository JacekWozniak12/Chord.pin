import { Part, Synth, PolySynth, Pattern, Transport, Time} from "Tone";
import { Note, Options } from "./Definitions";

export class Audio{
    
    private Instrument : PolySynth
    private Notes : Note[];
    
    constructor(){
        this.Setup();
    }

    Setup(){ 
           
        this.Notes = [
            new Note("C3", new Options(0.2, "3", "1n")),
            new Note("C2", new Options(1, "1", "2"))
        ]  

        this.Instrument = new PolySynth(
            {
                oscillator: {
                    type: 'triangle8'
                },
                envelope: {
                    attack: 2,
                    decay: 1,
                    sustain: 0.4,
                    release: 4
                }
            });
        this.Instrument.toMaster();
    }

    Dispose(){
        this.Instrument.dispose();
        this.Instrument = null;
    }

    Play(notes : Note[] = this.Notes){
        
        notes.forEach(e => {
            this.Instrument.triggerAttackRelease(e.name, e.options.duration, e.options.delay)
        });
    }

    Select(notes : Note[]){
        this.Notes = notes;
    }
}



