import '../scss/main.scss';
import { Audio } from './audio';
import { GUI as G } from './gui';
import { Database } from './database';
import { MenuSettings, Fretboard, MenuPlayer, Prompt } from './components/Elements';

// init
const audio = new Audio().setup();
const database = new Database();
audio.setOptions(database.getOptions());

const title = new G.Element("h1").setText("Chord.pin");
const globalOptions = new MenuSettings(database);
const fretboard = new Fretboard(database, audio);
const menu = new MenuPlayer(database, audio, fretboard);
const prompt = new Prompt("prompt", audio, database, fretboard);

prompt.parser.subscribe(fretboard.selectChord.bind(fretboard))

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