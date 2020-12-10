//#region imports
import { GUI } from "./GUI";
import { NotePosition } from "../definitions/NotePosition";
import { Options } from "../definitions/Options";
import { NoteSet } from "../definitions/NoteSet";
import { Notifier } from "../definitions/Observer";
import { SettingsDisplay } from "./SettingsDisplay";
import { Note } from "../definitions/Note";
//#endregion

export class GuitarStringNote extends GUI.Element<HTMLDivElement>
{
    note: NotePosition;
    selectedEvent: Notifier<NotePosition | Note>;
    deselectedEvent: Notifier<NotePosition | Note>;
    el_settings: SettingsDisplay;

    constructor(noteName: string, index: number, set: NoteSet, toneString: string) {
        let note = new NotePosition(noteName, index, new Options(), set);
        super("div", "", note.name.replace("#", "S") + "-on-" + toneString);
        this.note = note;
        this.el_settings = new SettingsDisplay(note.options).
            addListener("click", function (event) { event.stopPropagation(); });
        this.el_settings.htmlElement.classList.add("hidden");
        this.setText(note.name);
        this.parentElements([this.el_settings]);
    }

    clear() {
        let found = document.querySelectorAll("note-selected");
        found.forEach(x => {
            x.classList.remove("note-selected");
            x.classList.remove("important-note-selected");
        });
    }

    select(note: Note = null) {
        this.htmlElement.classList.add("note-selected", "important-note-selected");
        let found = document.querySelectorAll(`div[id*="${this.note.name.replace("#", "S")}"]`);
        found.forEach(x => {
            x.classList.add("note-selected");
        });
        if (note != null) { this.note = new NotePosition(note.name, 0, new Options, this.note.getNoteSet()); }
        this.selectedEvent.notify(this.note);
    }

    deselect() {
        this.htmlElement.classList.remove("note-selected", "important-note-selected");
        let found = document.querySelectorAll(`div.important-note-selected[id*="${this.note.name.replace("#", "S")}"]`);
        if (found.length == 0) {
            found = document.querySelectorAll(`div[id*="${this.note.name.replace("#", "S")}"]`);
            found.forEach(x => {
                x.classList.remove("note-selected");
            });
        }
        this.deselectedEvent.notify(this.note);
    }

    toggle() {
        if (this.htmlElement.classList.contains("important-note-selected")) this.deselect();
        else this.select();
    }
}
