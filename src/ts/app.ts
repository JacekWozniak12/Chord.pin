import '../scss/main.scss';
import { Audio } from './app/audio';
import { App_Fretboard, App_Prompt, App_Settings } from './app/app-parts';
import { GUI_Element } from './app/gui';

new GUI_Element("h1").setText("Chord.pin");

const app = new App_Prompt("prompt");
const fretBoard = new App_Fretboard();
const globalSettings = new App_Settings();