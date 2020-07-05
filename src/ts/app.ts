import '../scss/main.scss';
import { Audio } from './audio';
import { Components as C } from "./components"
import { GUI as G } from './gui';
import { Database } from './database';

// init
const audio = new Audio().setup();
const database = new Database();

const title = new G.Element("h1").setText("Chord.pin");
// const prompt = new C.Interfaces.Prompt("prompt", audio);
// const info = new G.Element("div").setText("or choose from those below:");
const fretboard = new C.Interfaces.Fretboard(database, audio);
const player = new C.Interfaces.Player(audio);
const selector = new C.Interfaces.ChordDatabase(database, fretboard);
const adder = new C.Interfaces.ChordAdder(database, audio);

function clear(){
    database.clear();
    selector.clearSelectables();
}

const container = new G.Element("div", "", "chord-pin")
    .parentElements(
        [
            title.htmlElement,
            // prompt.htmlElement,
            // info.htmlElement,
            fretboard.htmlElement,
            player.htmlElement,
            selector.htmlElement,
            adder.htmlElement,
            new G.Element("div").setText("CLEAR").addListener("click", clear.bind(this)).htmlElement
        ]
    )

// destroy 
window.addEventListener("beforeunload", database.saveToLocalStorage);
window.addEventListener("beforeunload", audio.dispose);