import { Chord, Options } from "./definitions";

export class Database{

    chords : Chord[];
    globalOptions : Options;
    storage = localStorage;

    constructor(){
        this.loadFromLocalStorage();
    }

    loadFromLocalStorage(){
        try{
            this.chords = JSON.parse(localStorage.getItem("ChordPin_Chord")) as Chord[];
            this.globalOptions = JSON.parse(localStorage.getItem("ChordPin_Options")) as Options;
        }
        catch{
            console.log("LOADING FROM LOCAL STORAGE FAILED");
        }
    }

    saveToLocalStorage(){
        try{
            localStorage.setItem("ChordPin_Chord", JSON.stringify(this.chords));
            localStorage.setItem("ChordPin_Options", JSON.stringify(this.globalOptions));
        }
        catch{
            console.log("SAVING TO LOCAL STORAGE FAILED");
        }
    }

    setChords(chords : Chord[]) : this{
        this.chords = chords;
        return this;
    }

    getChords() : Chord[]{
        return this.chords;
    }

}