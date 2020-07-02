import { GUI_Element } from '../gui';
import { Parser } from '../parser';
import { Audio } from '../audio';

export class app_prompt implements INotify{
    parser: Parser;
    audio: Audio;
    input: GUI_Element<HTMLInputElement>;

    constructor(promptID: string, audio: Audio) {
        this.input = new GUI_Element("input", "", promptID);
        this.audio = audio;
        this.input.element.setAttribute("placeholder", "...write command here");
        this.parser = new Parser(this.input.element);
    }

    notify(info : string){
        this.input.element.value = info;
    }

    apply() {

    }
}

export interface INotify{
    
}