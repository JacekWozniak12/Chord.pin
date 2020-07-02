import { GUI_Listener } from '../gui';
import { Note } from '../definitions';
import { Audio } from '../audio';

export class app_note extends GUI_Listener<HTMLDivElement> {
    core: Note;
    collectionId: string;
    el_menu: GUI_Listener<HTMLDivElement>;
    el_add: GUI_Listener<HTMLDivElement>;
    el_del: GUI_Listener<HTMLDivElement>;
    el_settings: GUI_Listener<HTMLDivElement>;
    audio: Audio;

    constructor(type: string, className: string, id: string = null,
        parent: string = "body", trigger: string, f: EventListener,
        note: Note, collectionId: string) {
        super(type, className, id, parent, trigger, f, "");
        this.core = note;
        this.collectionId = collectionId;
    }

    setup(audio: Audio) {
        this.audio = audio;
    }

    displayMenu() {
        //displays
    }

    hideMenu() {
        //hides
    }

    clear() {
        let found = document.querySelectorAll("note-selected");
        found.forEach(x => {
            x.classList.remove("note-selected");
            x.classList.remove("important-note-selected");
        });

    }

    toggle() {
        let found = document.querySelectorAll(`div[id*="${this.core.name.replace("#", "S")}"]`);
        if (this.element.classList.contains("note-selected") && !this.element.classList.contains("important-note-selected")) {
            this.audio.addNote(this.core);
            this.element.classList.toggle("important-note-selected");
        }
        else {
            found.forEach(x => {
                x.classList.toggle("note-selected");
                x.classList.remove("important-note-selected");
            });
            if (this.element.classList.contains("note-selected")) {
                this.audio.addNote(this.core);
                this.element.classList.toggle("important-note-selected");
            }
            else {
                this.audio.deleteNote(this.core);
            }
        }
    }

    select(){
        this.element.classList.add
        ("note-selected", "important-note-selected");

        let found = document.querySelectorAll(`div[id*="${this.core.name.replace("#", "S")}"]`);
        found.forEach(x => {
            x.classList.toggle("note-selected");
        });
    }

    unselect(){
        this.element.classList.remove
        ("note-selected", "important-note-selected");

        let found = document.querySelectorAll(`div[id*="${this.core.name.replace("#", "S")}"]`);
        found.forEach(x => {
            x.classList.remove
            ("note-selected", "important-note-selected");
        });
    }
}
