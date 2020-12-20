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
const fretboard = new Fretboard(tuning, 24, "E2", "E4", main);
const list = new ChordList(main);
const player = new Player(main, list);
fretboard.addEvent.subscribe(list.update);

app.parentElements([title, fretboard]);