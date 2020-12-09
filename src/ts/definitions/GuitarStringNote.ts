import { GUI } from "../gui/GUI";


export class GuitarStringNote extends GUI.Element<HTMLDivElement>
{
    constructor(noteName: string) {
        super("div", "", noteName.replace("#", "S"));
    }
}
