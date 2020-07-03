import { Time, Frequency } from "Tone";

export {
    Note, Chord, Options
}

class Note{

    constructor(
        name: string, 
        options: Options = new Options(),
        transposition: number = null
        )
    {
        if(this.isValidName(name)){
            this.name = Frequency(name).transpose(transposition).toNote();
            this.options = options;
        }
        else throw "Invalid note name";
    }

    name: string;
    options: Options;

    isValidName(name: string): boolean{
        let temp = name.
            toUpperCase().
            trim().
            replace(
                /([^ABCDEFG][^#b][^0-9]|[^ABCDEFG][^0-9])/g, ""
                );
        if(temp.length > 1 && temp.length < 4) return true;
        else return false;
    }
}

class Chord{
    
    constructor(     
        notes: Note[], 
        name: string = "", 
        description: string = "", 
        options: Options = null)
        {
            this.name = name;
            this.notes = notes;
            this.description = description;
            this.options = options;
    }

    name: string;
    description: string;
    notes: Note[];
    options: Options = null;

    returnContent(): string{
        let s = "";

        this.notes.forEach(element => {
            s = s.concat(element.name, " ^ ")
        });
        
        return s.slice(0, s.length - 2)
    }
}

class Options{

    constructor(
        volume:     number = 0.5,
        duration:   string | number = 1,
        delay:      string | number = 0
        )
        {
            try{
                this.volume = volume;
                this.duration = Number.parseFloat(duration as string);
                this.delay = Number.parseFloat(delay as string);
            }
            catch (e){
                this.duration = 1;
                this.delay = 0;               
                throw "Argument Exception - Writing default options"
            }
        }
    
    volume: number;
    // Using construction method from Time
    duration: number;
    delay: number;
    
    setDelay(delay: number){
        this.delay = delay
    }

    setDuration(duration: number){
        this.duration = duration;
    }
}

