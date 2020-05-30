import { Note, Options } from "./definitions";

export class GUI_ChordMenu{
    quickPlay: HTMLBaseElement;
    edit: HTMLBaseElement;
    set: HTMLBaseElement;
}

export class GUI_MainWindow{
    play: HTMLBaseElement;

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