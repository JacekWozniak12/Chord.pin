import { GUI_Element } from '../gui';
import { Frequency } from "Tone";
import { Note } from '../definitions';
import { Audio } from '../audio';
import { app_note } from "./noteDisplay";

export class app_fretboard {
    stringAmount = 6;
    frets = 25;
    startingFrequencyNote = ["E2", "A2", "D3", "G3", "B3", "E4"];

    constructor(audio: Audio) {
        new GUI_Element("div", "", "openString");
        new GUI_Element("div", "", "fretboard");
        let currentNote = this.startingFrequencyNote[0];

        for (let i = 1; i < this.stringAmount + 1; i++) {
            new GUI_Element("div", "string", `string-${i}`, "#fretboard");
            for (let j = 0; j < this.frets; j++) {
                currentNote = this.createNoteEl(i, j, currentNote, audio);
            }
            currentNote = this.startingFrequencyNote[i];
        }
    }

    private createNoteEl(i: number, j: number, currentNote: string, audio: Audio) {
        let part = `#string-${i}`;
        if (j == 0)
            part = "#openString";

        let note = new app_note("div", "note", currentNote.replace("#", "S").concat(`-string-${i}`), part, "mouseover", null, new Note(currentNote), `string-{i}`);
        note.addListener("click", (note.toggle.bind(note)));
        note.setup(audio);
        note.element.innerText = currentNote.replace("S", "#");
        currentNote = new Frequency(currentNote).transpose(1).toNote();
        return currentNote;
    }

    notify
}
