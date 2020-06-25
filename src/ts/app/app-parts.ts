import { GUI_Element, GUI_Listener } from './gui';
import { Frequency } from "Tone";
import { Parser } from './parser';
import { Database } from './database';
import { Chord, Options, Note } from './Definitions';
import { Audio } from './audio';

export class App_Fretboard{
    stringAmount = 6;
    frets = 25;
    startingFrequencyNote = ["E2", "A2", "D3", "G3", "B3", "E4"];
    
    constructor(audio: Audio){
        new GUI_Element("div", "", "openString");
        new GUI_Element("div", "", "fretboard");     
        let currentNote = this.startingFrequencyNote[0];
        
        for(let i = 1; i < this.stringAmount + 1; i++){                    
            new GUI_Element("div", "string", `string-${i}`, "#fretboard"); 
            for(let j = 0; j < this.frets; j++){               
                currentNote = this.createNoteEl(i, j, currentNote, audio);               
            }
            currentNote = this.startingFrequencyNote[i];
        }
    }

    private createNoteEl(i: number, j: number, currentNote: string, audio: Audio) {
        let part = `#string-${i}`;
        if (j == 0)
            part = "#openString";
        
        let note = new App_Note
        ("div", "note", currentNote.replace("#", "S").concat(`-string-${i}`), part, "mouseover", null, new Note(currentNote), `string-{i}`);
        note.addListener("click", (note.select.bind(note)));
        note.setup(audio);
        note.element.innerText = currentNote.replace("S", "#");
        currentNote = new Frequency(currentNote).transpose(1).toNote();
        return currentNote;
    }    
}


export class App_ChordList{
    db : Database;

    listOfChords = new GUI_Element("select", "select", "chord-selector");
    constructor(){

    }
}

export class App_Note extends GUI_Listener<HTMLDivElement>{
    note: Note;
    collectionId : string;
    el_menu : GUI_Listener<HTMLDivElement>;
    el_add: GUI_Listener<HTMLDivElement>;
    el_del: GUI_Listener<HTMLDivElement>;
    el_settings: GUI_Listener<HTMLDivElement>;
    audio: Audio;

    constructor(type: string, className: string, id: string = null, 
        parent: string = "body", trigger: string, f : EventListener, 
        note : Note, collectionId : string)
        {
        super(type, className, id, parent, trigger, f, "");
        this.note = note;       
        this.collectionId = collectionId;
    }

    setup(audio : Audio){
        this.audio = audio;
    }

    displayMenu(){
        //displays
    }

    hideMenu(){
        //hides
    }

    clear(){
        let found = document.querySelectorAll("note-selected");
        found.forEach(x => {
            x.classList.remove("note-selected");
            x.classList.remove("important-note-selected");
        })
     
    }
    
    select(){
        let found = document.querySelectorAll(`div[id*="${this.note.name.replace("#", "S")}"]`);
        if(this.element.classList.contains("note-selected") && !this.element.classList.contains("important-note-selected")){
            this.audio.addNote(this.note);
            this.element.classList.toggle("important-note-selected");
        }
        else{
            found.forEach(x => {
                x.classList.toggle("note-selected");
                x.classList.remove("important-note-selected");
            });
            if(this.element.classList.contains("note-selected")){
                this.audio.addNote(this.note);
                this.element.classList.toggle("important-note-selected");
            }
            else{
                this.audio.deleteNote(this.note);
            }
        }
        
       //select all having same name
    }
}

export class App_Settings{
    el_main :           GUI_Element<HTMLDivElement>;
    el_title :          GUI_Element<HTMLDivElement>;
    el_volume :         GUI_Element<HTMLInputElement>;
    el_duration :       GUI_Element<HTMLInputElement>;
    el_delay :          GUI_Element<HTMLInputElement>;

    currentModifiedOptions : Options;

    constructor(){   
        
        this.el_main = new GUI_Element("div", "settings");
        this.createSettingsTitle();
        this.createVolume();  
        this.createDuration();
        this.createDelay();          
    }

    private createSettingsTitle(title: string = "settings") {
        this.el_title = new GUI_Element("div", "", "");
        this.el_title.element.textContent = title;
        this.el_main.parentElements([this.el_title.element]);
    }

    setOption(options: Options, title: string){
        this.currentModifiedOptions = options;
        this.el_title.element.textContent = title;
    }

    unsetOption(){
        this.currentModifiedOptions = null;
        // null everything
        this.el_main.element.classList.toggle("hidden");
    }

    private createSetting
    (type: string, className: string, id: string, img: string) : GUI_Element<HTMLElement>{
        let i = new GUI_Element("img").modifyAttribute("src", img);
        let r = new GUI_Element(type, className, id);
        let u = new GUI_Element("div", "setting-container");
        u.parentElements([i.element, r.element]);
        this.el_main.parentElements([u.element]);
        return r;
    }

    private createDelay() {     
        this.el_delay = <any>this.createSetting("input", "", "", "https://img.icons8.com/windows/32/000000/add-time.png").
        modifyAttribute("placeholder", "00").
        modifyAttribute("type", "number").
        modifyAttribute("min", "0").
        modifyAttribute("max", "10");
    }

    private createDuration() {
        this.el_duration = <any>this.createSetting("input", "", "", "https://img.icons8.com/windows/32/000000/time-slider.png").
        modifyAttribute("placeholder", "01").
        modifyAttribute("type", "number").
        modifyAttribute("min", "0").
        modifyAttribute("max", "10");
    }

    private createVolume() {
        this.el_volume = <any>this.createSetting("input", "", "", "https://img.icons8.com/windows/32/000000/speaker.png").
        modifyAttribute("type", "range").
        modifyAttribute("min", "0").
        modifyAttribute("max", "1").
        modifyAttribute("step", "0.01");
    }
}

export class App_Player{
    
    el_play : GUI_Listener<HTMLDivElement>;
    audio : Audio;
    currentChord: Chord;

    constructor(audio : Audio){
        this.el_play = new GUI_Listener("div", "icon", "", "body", "click", this.play.bind(this), "https://img.icons8.com/ios-glyphs/32/000000/play.png");
        this.audio = audio;
    }

    play(){
        this.audio.play(this.currentChord);
    }
}

export class App_Prompt{
    parser : Parser;

    constructor(promptID : string){
        let a = new GUI_Element("input", "", promptID);
        a.element.setAttribute("placeholder", "...write command here");
        this.parser = new Parser(promptID);
    } 
}

export class App_Help{

}