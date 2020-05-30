import { Note, Options } from "./definitions";

export class GUI_MainWindow{

    id: string;
    element: HTMLDivElement;
    play: HTMLButtonElement;
    pause: HTMLButtonElement;
    stop: HTMLButtonElement;

    constructor(id: string = "main"){
        this.handleMainDiv(id);
        this.createElements();
        this.appendToMainDiv();
    }

    private appendToMainDiv() {
        this.element.appendChild(this.play);
        this.element.appendChild(this.pause);
        this.element.appendChild(this.stop);
    }

    private handleMainDiv(id: string) {
        this.element = document.createElement("div");
        this.id = id;
        this.element.id = id;
        document.querySelector("body").appendChild(this.element)
    }

    private createElements() {
        this.play = this.createElement("button", "play") as HTMLButtonElement;
        this.pause = this.createElement("button", "pause") as HTMLButtonElement;
        this.stop = this.createElement("button", "stop") as HTMLButtonElement;
    }

    private createElement<T>(type: string, content: string = null) 
    : HTMLElement
    {
        // let e = document.createElement(, );
        e.textContent = content;
        return e;
    }
}

export class GUI_ChordRepresentation{
    menu: GUI_ChordMenu;
    selectedCells: GUI_SelectedGuitarCell;

    constructor(){
        new GUI_ChordMenu();
    }
}

export class GUI_ChordMenu{
    quickPlay: HTMLBaseElement;
    edit: HTMLBaseElement;
    set: HTMLBaseElement;  
}

export class GUI_ChordTable{
    size: number;
    firstNote: string;
    cells;
    selectedCells;

    update(){

    }

    draw(){

    }

    selectNotes(){

    }
}

export class GUI_GuitarCell{
    noteName: string;

}

export class GUI_SelectedGuitarCell extends GUI_GuitarCell{
    note: Note;

}