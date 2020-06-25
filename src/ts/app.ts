import '../scss/main.scss';
import { Audio } from './app/audio';
import { App_Fretboard, App_Prompt, App_Player } from './app/app-parts';
import { GUI_Element} from './app/gui';

const audio = new Audio();
audio.setup();
new GUI_Element("h1").setText("Chord.pin");
new App_Prompt("prompt");
new GUI_Element("div").setText("or choose from those below:");
new App_Fretboard(audio);
new App_Player(audio);

// new GUI_Button("img", "", "", "body", a, "https://img.icons8.com/windows/32/000000/help.png");
// function a() {
//     alert("Help")
// }