import { Tone } from 'tone';
import { GUI_Element } from './gui';

export class App_Main{

}

export class App_Fretboard{
    dummyInstrument = new Tone.MonoSynth();
    // 6 x 25 [ from 0 to 24 ]
    stringAmount = 6;
    frets = 25;

    constructor(){
        for(let i = 1; i < this.stringAmount + 1; i++){           
            
            let collection = 
            new GUI_Element<HTMLDivElement>("div", "string", `string-${i}`); 
            for(let j = this.frets; j > 0; j--){

            }
        }
    }
}