class Note {
    name: string;
    frequency: number;
}

class RootNote extends Note{}

class ChordNote{
    note: Note;
    volume: number;
    duration: number;
    delay: number;
}

class Chord{
    name: string;
    description: string;
    notes: ChordNote[];
}

class Options{
    rootNote : RootNote;
    notes : Note[];
    duration: number;
    delay: number;
    instrument: Instrument;
}

// todo 
class Instrument{
    //
}
