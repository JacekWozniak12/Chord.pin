import { Chord } from '../definitions/Chord';
import { NotePosition } from '../definitions/NotePosition';
import { VariableNotifier } from '../definitions/Observer';
import { Options } from '../definitions/Options';
import { GUI } from '../gui/GUI';
import { Audio } from './Audio';
import { Database } from './Database';
import { Parser } from './Parser';

// database - both options / chord
// settings changer - options 
// chord prompt - both, update every change 
// chord fretboard - chord, update every change

export class Main {
    database: Database;
    options: VariableNotifier<Options>;
    chords: VariableNotifier<Chord[]>;
    selectedNotes: NotePosition[];
    parser: Parser;

    getChord(str: string): Chord {
        return this.chords.variable.filter(x => x.name.variable == str)[0];
    }

    addChord(chord: Chord) {
        console.log(chord);
        this.chords.variable.push(chord);
    }

    constructor() {
        this.database = new Database();
        this.options = new VariableNotifier(this.database.options);
        this.chords = new VariableNotifier(this.database.chords);
        const prompt = new GUI.InputElement("prompt", "prompt");
        prompt.html.placeholder = "...write here";
        this.parser = new Parser(prompt.html, this);
    }

}



