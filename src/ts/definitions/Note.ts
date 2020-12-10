import { Frequency } from "Tone";
import { Options } from "./Options";

export class Note {

    constructor(name: string, transposition: number = null, options: Options = new Options()) {
        if (this.isValidName(name)) {
            this.name = Frequency(name).transpose(transposition).toNote();
            this.options = options;
        }
        else throw "Invalid note name";
    }

    name: string;
    options: Options;

    isValidName(name: string): boolean {
        let temp = name.toUpperCase().trim()
            .replace(/([^ABCDEFG][^#b][^0-9]|[^ABCDEFG][^0-9])/g, "");

        if (temp.length > 1 && temp.length < 4) return true;
        else return false;
        
    }
}
