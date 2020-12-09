import { GUI } from "../gui";
import { Notifier } from "../definitions/Observer";
import { DisplayableNote } from "../definitions/DisplayableNote";
import { Note } from "../definitions/Note";
import { SettingsDisplay } from "../elements";

// private SetupNote(note: NoteDisplay, currentNote: string, audio: Audio): NoteDisplay {
//     note.addListener("click", note.toggle.bind(note)).
//         addListener("mouseover", note.showOptions.bind(note)).
//         addListener("mouseout", note.hideOptions.bind(note)).
//         setText(currentNote.replace("S", "#")).
//         setup(audio);
//     return note;
// }

export class NoteDisplay extends GUI.Element<HTMLDivElement> {

    note: Note;
    selectedEvent: Notifier<DisplayableNote | Note>;
    deselectedEvent: Notifier<DisplayableNote | Note>;
    el_settings: SettingsDisplay;

    constructor(className: string, id: string = null, parent: string = "body", trigger: string, f: EventListener, note: Note) {
        super("div", className, id, parent, "", trigger, f);
        this.el_settings = new SettingsDisplay(note.options).
            addListener("click", function (event) { event.stopPropagation(); });
        this.el_settings.htmlElement.classList.add("hidden");
        this.note = note;
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
        if (note != null) { this.note = note; }
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
        if (this.htmlElement.classList.contains("important-note-selected")) {
            this.deselect();
        }
        else
            this.select();
    }
}
