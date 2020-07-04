import { Chord, Options } from "./Definitions";

export class Database{

    chords : Chord[];
    globalOptions : Options;
    storage = localStorage;

    loadFromLocalStorage(){
        
    }

    save(chords : Chord[]){

    }

    findChord(input : string){

    }
}