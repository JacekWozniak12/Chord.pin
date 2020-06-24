import { GUI_Element } from './gui';
import { Frequency } from "Tone";
import { Parser } from './parser';
import { Database } from './database';
import { Chord } from './Definitions';

export class App_Fretboard{
    stringAmount = 6;
    frets = 25;
    startingFrequencyNote = ["E2", "A2", "D3", "G3", "B3", "E4"];

    constructor(){
        new GUI_Element("div", "", "openString");
        new GUI_Element("div", "", "fretboard");     
        let currentNote = this.startingFrequencyNote[0];
        
        for(let i = 1; i < this.stringAmount + 1; i++){           
            
            new GUI_Element("div", "string", `string-${i}`, "#fretboard"); 

            for(let j = 0; j < this.frets; j++){               
                currentNote = this.createNoteEl(i, j, currentNote);               
            }
            currentNote = this.startingFrequencyNote[i];
        }
    }

    private createNoteEl(i: number, j: number, currentNote: string) {
        let part = `#string-${i}`;
        if (j == 0)
            part = "#openString";
        let note = new GUI_Element("div", "note", `note-${currentNote}`, part);
        note.element.innerText = currentNote;
        currentNote = new Frequency(currentNote).transpose(1).toNote();
        return currentNote;
    }
}

export class App_Prompt{
    parser : Parser;

    constructor(promptID : string){
        let a = new GUI_Element("input", "", promptID);
        a.element.setAttribute("placeholder", "...write command here");
        this.parser = new Parser(promptID);
    } 
}

export class App_Help{

}

export class App_ChordList{
    db : Database;

    listOfChords = new GUI_Element("select", "select", "chord-selector");
    // <option value="">C5 Minor</option>
    constructor(){

    }
}

export class App_Note{
    el_main : GUI_Element<HTMLDivElement>;
    el_add;
    el_del;
    el_setting;

    constructor(){

    }
}

export class App_Settings{
    el_main :           GUI_Element<HTMLDivElement>;
    el_settingButton :  GUI_Element<HTMLButtonElement>;
    el_volume :         GUI_Element<HTMLInputElement>;
    el_duration :       GUI_Element<HTMLInputElement>;
    el_delay :          GUI_Element<HTMLInputElement>;

    constructor(){     
        this.createDuration();
        this.createDelay();  
        this.createVolume();  
    }

    private createDelay() {
        //label
        this.el_delay = new GUI_Element("input", "", "");
        this.el_delay.element.setAttribute("placeholder", "00");
        this.el_delay.element.setAttribute("type", "number");
        this.el_delay.element.setAttribute("min", "0");
        this.el_delay.element.setAttribute("max", "10");
    }

    private createDuration() {
        //label
        this.el_duration = new GUI_Element("input", "", "");
        this.el_duration.element.setAttribute("placeholder", "01");
        this.el_duration.element.setAttribute("type", "number");
        this.el_duration.element.setAttribute("min", "0");
        this.el_duration.element.setAttribute("max", "10");
    }

    private createVolume() {
        //label
        this.el_volume = new GUI_Element("input", "", "");
        this.el_volume.element.setAttribute("type", "range");
        this.el_volume.element.setAttribute("min", "0");
        this.el_volume.element.setAttribute("max", "1");
        this.el_volume.element.setAttribute("step", "0.01");
    }
}

export class App_Player{
    el_play;
    el_selectedChord;
    el_saveChord;

    currentChord: Chord;

}