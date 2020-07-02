import { Parser } from "./parser";
import { GUI } from "./gui";
import { Audio } from './audio';
import { Options, Chord, Note } from "./Definitions";
import { Frequency, isNumber } from "Tone";

// describes items used to built app
export module Components {

    export module Interfaces {

        export class Prompt extends GUI.Element<HTMLInputElement>{

            parser: Parser;
            audio: Audio;

            constructor(promptID: string, audio: Audio) {
                super("input", "input", promptID)
                this.parser = new Parser(this.htmlElement);
                this.audio = audio;
                this.htmlElement.setAttribute("placeholder", "...write command here");
            }

            notify(info: string) {
                this.htmlElement.value = info;
            }

            apply(): this {
                return this;
            }
        }

        export class Player extends GUI.Element<HTMLElement>{
            el_play: GUI.Element<HTMLDivElement>;
            audio: Audio;
            currentChord: Chord;

            constructor(audio: Audio) {
                super("div", "icon", "", "body", "https://img.icons8.com/ios-glyphs/32/000000/play.png");
                this.audio = audio;
                this.addListener("click", this.play.bind(this));
            }

            play() {
                this.audio.play(this.currentChord);
            }
        }

        export class Fretboard extends GUI.Element<HTMLElement>{
            stringAmount = 6;
            frets = 25;
            startingFrequencyNote = ["E2", "A2", "D3", "G3", "B3", "E4"];
            noteBoardName: string = "fretboard"

            constructor(audio: Audio) {
                super("div", "", "board");

                this.parentElements([
                    new GUI.Element("div", "", "openString").htmlElement,
                    new GUI.Element("div", "", this.noteBoardName).htmlElement
                ]);

                let currentNote = this.startingFrequencyNote[0];

                for (let i = 1; i < this.stringAmount + 1; i++) {
                    new GUI.Element("div", "string", `string-${i}`, `#${this.noteBoardName}`);

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

                let note = new Data.NoteDisplay("div", "note",
                    currentNote.
                        replace("#", "S").
                        concat(`-string-${i}`),
                    part, null, null,
                    new Note(currentNote), `string-{i}`);

                note.
                    addListener("click", note.toggle.bind(note)).
                    addListener("mouseover", note.showOptions.bind(note)).
                    addListener("mouseout", note.hideOptions.bind(note)).
                    setText(currentNote.replace("S", "#")).
                    setup(audio);

                currentNote = new Frequency(currentNote).transpose(1).toNote();
                return currentNote;
            }
        }
    }

    export module Data {

        export class Settings extends GUI.Element<HTMLElement>{

            el_title: GUI.Element<HTMLDivElement>;
            el_volume: GUI.Element<HTMLInputElement>;
            el_duration: GUI.Element<HTMLInputElement>;
            el_delay: GUI.Element<HTMLInputElement>;

            options: Options;

            constructor(
                note: Note = null,
                type: string = "div",
                className: string = "settings",
                id: string = null,
                parent: string = "body"
            ) {
                super(type, className, id, parent);
                this.setSettingsTitle(note.name + " Settings");
                this.createVolume();
                this.createDuration();
                this.createDelay();
                this.options = note.options;
            }

            private updateVolume() : this{
                this.options.volume = Number.parseFloat(this.el_volume.htmlElement.value);
                console.log(this.options.volume);
                return this;
            }

            private updateDuration() : this{
                this.options.setDuration(Number.parseFloat(this.el_duration.htmlElement.value));
                return this;
            }

            private updateDelay() : this{
                this.options.setDelay(Number.parseFloat(this.el_delay.htmlElement.value))
                return this;
            }

            setSettingsTitle(title: string = "settings") {
                this.el_title = new GUI.Element("div", "", "");
                this.el_title.htmlElement.textContent = title;
                this.parentElements([this.el_title.htmlElement]);
            }

            private createSetting(type: string, className: string, id: string, img: string): GUI.Element<HTMLElement> {
                let i = new GUI.Element("img").modifyAttribute("src", img);
                let r = new GUI.Element(type, className, id);
                let u = new GUI.Element("div", "setting-container");
                u.parentElements([i.htmlElement, r.htmlElement]);
                this.parentElements([u.htmlElement]);
                return r;
            }

            private createDelay() {
                this.el_delay = <any>this.createSetting("input", "", "", "https://img.icons8.com/windows/32/000000/add-time.png").
                    modifyAttribute("placeholder", "00").
                    modifyAttribute("type", "number").
                    modifyAttribute("min", "0").
                    modifyAttribute("max", "10").
                    addListener("focusout", this.updateDelay.bind(this));
            }

            private createDuration() {
                this.el_duration = <any>this.createSetting("input", "", "", "https://img.icons8.com/windows/32/000000/time-slider.png").
                    modifyAttribute("placeholder", "01").
                    modifyAttribute("type", "number").
                    modifyAttribute("min", "0").
                    modifyAttribute("max", "10").
                    addListener("focusout", this.updateDuration.bind(this));
            }

            private createVolume() {
                this.el_volume = <any>this.createSetting("input", "", "", "https://img.icons8.com/windows/32/000000/speaker.png").
                    modifyAttribute("type", "range").
                    modifyAttribute("min", "0").
                    modifyAttribute("max", "1").
                    modifyAttribute("step", "0.01").
                    addListener("focusout", this.updateVolume.bind(this));
            }
        }

        export class NoteDisplay extends GUI.Element<HTMLDivElement> {

            note: Note;
            collectionId: string;
            add: GUI.Element<HTMLDivElement>;
            del: GUI.Element<HTMLDivElement>;
            settings: Settings;
            audio: Audio;

            constructor(
                type: string, 
                className: string, 
                id: string = null,
                parent: string = "body", 
                trigger: string, f: EventListener,
                note: Note, collectionId: string) {
                super(type, className, id, parent, "", trigger, f);
                this.settings = new Settings(note);
                this.settings.htmlElement.classList.add("hidden");
                this.note = note;
                this.collectionId = collectionId;
            }

            setup(audio: Audio): this {
                this.audio = audio;
                this.parentElements([this.settings.htmlElement]);
                return this;
            }

            showOptions() {
                this.settings.htmlElement.classList.remove("hidden");
            }

            hideOptions() {
                this.settings.htmlElement.classList.add("hidden");
            }

            clear() {
                let found = document.querySelectorAll("note-selected");
                found.forEach(x => {
                    x.classList.remove("note-selected");
                    x.classList.remove("important-note-selected");
                });
            }

            toggle() {
                let found = document.querySelectorAll(`div[id*="${this.note.name.replace("#", "S")}"]`);
                if (this.htmlElement.classList.contains("note-selected") && !this.htmlElement.classList.contains("important-note-selected")) {
                    this.audio.addNote(this.note);
                    this.htmlElement.classList.toggle("important-note-selected");
                }
                else {
                    found.forEach(x => {
                        x.classList.toggle("note-selected");
                        x.classList.remove("important-note-selected");
                    });
                    if (this.htmlElement.classList.contains("note-selected")) {
                        this.audio.addNote(this.note);
                        this.htmlElement.classList.toggle("important-note-selected");
                    }
                    else {
                        this.audio.deleteNote(this.note);
                    }
                }
            }

            select() {
                this.htmlElement.classList.add
                    ("note-selected", "important-note-selected");

                let found = document.querySelectorAll(`div[id*="${this.note.name.replace("#", "S")}"]`);
                found.forEach(x => {
                    x.classList.toggle("note-selected");
                });
            }

            unselect() {
                this.htmlElement.classList.remove
                    ("note-selected", "important-note-selected");

                let found = document.querySelectorAll(`div[id*="${this.note.name.replace("#", "S")}"]`);
                found.forEach(x => {
                    x.classList.remove
                        ("note-selected", "important-note-selected");
                });
            }
        }
    }
}