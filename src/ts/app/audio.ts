import Tone, { PolySynth, Transport, Loop, Time } from "Tone";
import { Note, Chord } from "./Definitions";


export class Audio{
    
    private instrument : PolySynth
    private chord : Chord;
    
    constructor(){
        this.setup();
    }

    updateChord(chord: Chord){
        this.chord = chord;
    }

    addNote(note: Note){
        this.chord.notes.unshift(note);
    }

    deleteNote(note: Note){
        this.chord.notes = this.chord.notes.filter(x => x.name != note.name);
    }
    

    setup(){ 
                 
        this.chord = new Chord([])  

        this.instrument = new PolySynth(
           
            // , 
            // Synth,
            // {
            //     oscillator: {
            //         type: 'triangle8'
            //     },
            //     envelope: {
            //         attack: 2,
            //         decay: 1,
            //         sustain: 0.1,
            //         release: 1
            //     }
            // }
            );
        this.instrument.toMaster();
    }

    dispose(){
        this.instrument.dispose();
        this.instrument = null;
    }

    play(chord : Chord = this.chord){
        chord.notes.forEach(note => {
            this.instrument.triggerAttackRelease(note.name, note.options.duration); 
        });
      
    }
  
}



