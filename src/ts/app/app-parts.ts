import { GUI_Element } from './gui';
import { Frequency, Synth } from "Tone";
import { Parser } from './parser';
import { Database } from './database';

export class App_Main{

}

export class App_Fretboard{
    dummyInstrument = new Synth();
    // 6 x 25 [ from 0 to 24 ]
    stringAmount = 6;
    frets = 25;
    startingFrequencyNote = ["E2", "A2", "D3", "G3", "B3", "E4"];

    constructor(){
        let openString = new GUI_Element("div", "", "openString");
        let fretboard = new GUI_Element("div", "", "fretboard");     
        let currentNote = this.startingFrequencyNote[0];
        for(let i = 1; i < this.stringAmount + 1; i++){           
            
            let collection = 
            new GUI_Element("div", "string", `string-${i}`, "#fretboard"); 

            for(let j = 0; j < this.frets; j++){
                
                let part = `#string-${i}`;
                if(j == 0) part = "#openString";

                let note = new GUI_Element("div", "note", `note-${currentNote}`, part)               
                note.element.innerText = currentNote;               
                currentNote = new Frequency(currentNote).transpose(1).toNote();               
            }
            currentNote = this.startingFrequencyNote[i];
        }
    }
}

export class App_Prompt{
    parser : Parser;

    constructor(promptID : string){
        this.parser = new Parser(promptID);
    }
    
}

export class App_ChordList{
    db : Database;
}