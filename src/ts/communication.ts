import { Options, Chord, Note } from "./definitions";
import { Database } from './database';

// database - both options / chord
// settings changer - options 
// chord prompt - both, update every change 
// chord fretboard - chord, update every change

export class Main {
    database: Database;
    options: Options;
    chords: Chord[];

    getChord(str : string) : Chord{
        return this.chords.filter(x => x.name.var == str)[0];
    }
}



