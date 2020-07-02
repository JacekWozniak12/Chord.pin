import { GUI_Element } from '../gui';
import { Database } from '../database';

export class app_chordList {
    db: Database;

    listOfChords = new GUI_Element("select", "select", "chord-selector");
    constructor() {
    }
}
