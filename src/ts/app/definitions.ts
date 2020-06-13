export {
    Note, Chord, Options
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
        else throw "Invalid note name";
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
        volume: number = 1,
        duration: number = 1,
        delay: number = 0)
        {
            this.volume = volume;
            this.duration = duration;
            this.delay = delay;
    }
    
    volume: number;
    duration: number;
    delay: number;
    
}
