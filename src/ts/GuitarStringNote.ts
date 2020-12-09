import { GUI } from "./gui";


export class GuitarStringNote extends GUI.Element<HTMLDivElement>
{
    constructor(noteName: string) {
        super("div", "", noteName.replace("#", "S"));
    }
}
