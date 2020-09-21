// menu
// settings 
// fretboard

import { GUI } from "../gui";
import { DisplayableNote, Note, NoteSet, Options } from "../definitions"

export { Fretboard }

class Fretboard extends GUI.Element<HTMLDivElement>
{
    noteSet: NoteSet;
    strings: Number;
    frets: Number;

    el_container_string;

    constructor(strings: number, frets: number, startingNote: string | Note | DisplayableNote, options: Options) {
        super();

        this.parentElements([            new GUI.Element("div", "", "openString").htmlElement, new GUI.Element("div", "").htmlElement        ]);

        let position = 0;
        
        this.noteSet = new NoteSet(startingNote, (strings * frets));

    }

    // private createNoteEl(i: number, j: number, note : Note) {
    //     let part = `#string-${i}`;
    //     if (j == 0)
    //         part = "#openString";

    //     let noteDisplay = new NoteDisplay("note",
    //         currentNote.
    //             replace("#", "S").
    //             concat(`-string-${i}`),
    //         part, null, null,
    //         new Note(currentNote, position));

    //     this.setDefaultOptions(noteDisplay, options);

    //     noteDisplay = this.SetupNote(noteDisplay, currentNote, audio);
    //     this.noteDisplayed.push(noteDisplay);
    //     return currentNote;
    // }

    // private SetupNote(note: NoteDisplay, currentNote: string, audio: Audio): NoteDisplay {
    //     note.addListener("click", note.toggle.bind(note)).
    //         addListener("mouseover", note.showOptions.bind(note)).
    //         addListener("mouseout", note.hideOptions.bind(note)).
    //         setText(currentNote.replace("S", "#")).
    //         setup(audio);
    //     return note;
    // }

}

class GuitarString extends GUI.Element<HTMLDivElement>
{
    frets: number;
    position: number;
    noteSet: NoteSet;

    getLastPosition() : Number { return this.position + this.frets};
}

