import { PArt } from 'tone';
export {
    Note, Chord, Options, Instrument
}

class Note{

    constructor(
        name: string, 
        options: Options = null
        )
    {
        if(this.isValidName(name)){
            this.name = name;
            this.options = options;
        }
        else throw new Error("Invalid note name");
    }

    name: string;
    options: Options;

    isValidName(name: string): boolean{
        let temp = name.trim().replace(/([^A-G][^#b][^0-9]|[^A-G][^0-9])/g, "");
        if(temp.length > 1 && temp.length < 4) return true;
        else return false;
    }
}

class Chord{
    
    constructor(     
        notes: Note[], 
        name: string = "", 
        description: string = "")
        {
            this.name = name;
            this.notes = notes;
            this.description = description;
    }

    name: string;
    description: string;
    notes: Note[];
}

class Options{

    constructor(
        volume: number,
        duration: number,
        delay: number)
        {
            this.volume = volume;
            this.duration = duration;
            this.delay = delay;
    }
    
    volume: number;
    duration: number;
    delay: number;
}

class Instrument{
    
}
