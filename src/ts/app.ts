import '../scss/main.scss';
import { Fretboard } from "./gui/Fretboard";
import { GUI } from './gui/GUI';
import { Tuning } from "./Definitions/Tuning";
import { Parser } from './parts/Parser';

let tuning = new Tuning(["E2", "A2", "D3", "G3", "B4", "E4"])

const app = new GUI.Element("div", null, "chord.pin");
const title = new GUI.Element("h1").setText("chord.pin");
const fretboard = new Fretboard(tuning, 24, "E2", "E4");
const prompt = new GUI.InputElement("prompt", "prompt");
prompt.htmlElement.placeholder = "...write here";
const parser = new Parser(prompt.htmlElement);

app.parentElements([prompt, title, fretboard]);