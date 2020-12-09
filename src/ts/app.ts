import '../scss/main.scss';
import { Fretboard } from "./gui/Fretboard";
import { GUI } from './gui';
import { Tuning } from "./definitions/Tuning";


const app = new GUI.Element("div", null, "chord.pin");
const title = new GUI.Element("h1").setText("chord.pin");
const fretboard = new Fretboard(new Tuning(["E2", "A2", "D3", "G3", "B4", "E4"]), 24, "E2", "E4");

app.parentElements([title, fretboard]);