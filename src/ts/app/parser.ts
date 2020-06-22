import { Time } from "tone/Tone";
import { Options, Note, Chord } from "./Definitions";
import { Database } from './database';

export class Parser{

    db : Database; 

    // symbols start
        static readonly S_LOADING = "<<";
        static readonly S_SAVE = ">>";
        static readonly S_DELAY = "d:";
        static readonly S_TIME = "t:";
        static readonly S_VOLUME = "v:";
        static readonly S_CHORD_START = "{";
        static readonly S_CHORD_END = "}";
        static readonly S_OPTIONS_START = "(";
        static readonly S_OPTIONS_END = ")";
        static readonly S_CHORD_CONCAT = "^";
        static readonly S_STEP_SUB = "-";
        static readonly S_STEP_ADD = "+";
        static readonly S_PARAMETER_NEXT = ",";
    // symbols stop

    getOutput(input : string){
        let s = input.search(Parser.S_LOADING);
        if(s > 0){
            let t = input.slice(s, Parser.S_LOADING.length);
            let i = input.replace(t, "");
            this.loadChordFromDB(i);
        } 
        else{

        }
        // else
            // get chord strings
            // get option strings
            // get save string
    }

    //local storage

    loadChordFromDB(input : string, db : Database = this.db) : Chord{
        return db.chords.find(x => x.name == input);
    }

    saveChordToDB(chord : Chord, db : Database = this.db){

    };

    saveOptionToDB(options : Options, db: Database = this.db){

    };

    static getOptions(input : string) : Options {
        // wywołaj getDuration oraz getDelay
    }

    static getDuration(input : string) : Time {
        return new Time(input);
    }

    static getDelay(input : string) : Time {
        return new Time(input);
    }
    
    static getNote(input : string) : Note {
        

        // ustal opcje, wywołaj getOptions, zaaplikuj get Options do getNote
    }

    static getChord(input : string) : Chord {
        // podziel na nuty, wywołaj getNote;
    }

    static getGlobals(input : string = null) : Options {

        return new Options();
    }

    
}





// get prompt
// get event listeners
// 