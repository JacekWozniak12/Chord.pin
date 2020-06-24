import '../scss/main.scss';
import { Audio } from './app/audio';
import { App_Fretboard, App_Prompt, App_Settings } from './app/app-parts';
import { GUI_Element, GUI_Listener } from './app/gui';

const title = new GUI_Element("h1").setText("Chord.pin");
const app = new App_Prompt("prompt");
new GUI_Element("div").setText("or choose from those below:");
const fretBoard = new App_Fretboard();


// new GUI_Button("img", "", "", "body", a, "https://img.icons8.com/windows/32/000000/help.png");
// function a() {
//     alert("Help")
// }