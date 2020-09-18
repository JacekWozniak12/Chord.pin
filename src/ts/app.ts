import '../scss/main.scss';
import { Audio } from './audio';
import { GUI } from './gui';
import { MenuSettings, Fretboard, MenuPlayer, Prompt } from './components/elements';
import { Main } from './communication';

// init
const audio = new Audio().setup();
const main = new Main();
audio.setOptions(main.database.getOptions());

const title = new GUI.Element("h1").setText("Chord.pin");
const globalOptions = new MenuSettings(main.database, audio);
const fretboard = new Fretboard(main.database, audio);
const menu = new MenuPlayer(main.database, audio, fretboard);
const prompt = new Prompt("prompt", audio, main.database);

prompt.parser.subscribe(fretboard.notifyHandler.bind(fretboard))
prompt.parser.subscribe(globalOptions.settings.notifyHandler.bind(globalOptions.settings))

function clear() {
    main.database.clear();
    menu.chordSelector.clearSelectables();
}

const container = new GUI.Element("div", "", "chord-pin")
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
window.addEventListener("beforeunload", main.database.saveToLocalStorage);
window.addEventListener("beforeunload", audio.dispose);