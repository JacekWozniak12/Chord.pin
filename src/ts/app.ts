import '../scss/main.scss';
import { Fretboard } from "./gui/Fretboard";
import { GUI } from './gui/GUI';
import { Tuning } from "./definitions/Tuning";
import { Main } from './parts/Communication';
import { ChordList } from './gui/ChordList';
import { Player } from './gui/AudioPlayer';

let tuning = new Tuning(["E2", "A2", "D3", "G3", "B4", "E4"])

const app = new GUI.Element("div", null, "chord.pin");
const main = new Main();
const title = new GUI.Element("h1").setText("chord.pin");
const fretboard = new Fretboard(tuning, 25, "E2", "F6");
const list = new ChordList(main);
const player = new Player(main, list);

fretboard.addEvent.subscribe(main.addChord.bind(main));
main.chords.subscribe(list.update.bind(list));


const t = new GUI.Element("button", "show main");
t.addListener("click", e => {console.log(main)});
app.parentElements([title, fretboard]);