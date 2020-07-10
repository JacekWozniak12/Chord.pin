import '../scss/main.scss';
import { Audio } from './audio';
import { Components as C } from "./components"
import { GUI as G } from './gui';
import { Database } from './database';

// init
const audio = new Audio().setup();
const database = new Database();
audio.setOptions(database.getOptions());

const title = new G.Element("h1").setText("Chord.pin");
const globalOptions = new C.Interfaces.MenuSettings(database);
const fretboard = new C.Interfaces.Fretboard(database, audio);
const menu = new C.Interfaces.MenuPlayer(database, audio, fretboard);
const parser = new C.Interfaces.Prompt("prompt", audio, database, fretboard);

function clear(){
    database.clear();
    menu.chordSelector.clearSelectables();
}

const container = new G.Element("div", "", "chord-pin")
    .parentElements(
        [
            title.htmlElement,
            globalOptions.htmlElement,
            fretboard.htmlElement,
            menu.htmlElement,
            // new G.Element("div").setText("CLEAR").addListener("click", clear.bind(this)).htmlElement,
            // parser.htmlElement
        ]
    )

// destroy 
window.addEventListener("beforeunload", database.saveToLocalStorage);
window.addEventListener("beforeunload", audio.dispose);