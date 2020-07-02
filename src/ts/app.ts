import '../scss/main.scss';
import { Audio } from './audio';
import { Components } from "./components"
import { GUI } from './gui';

// init
const audio = new Audio();
audio.setup();
new GUI.Element("h1").setText("Chord.pin");
new Components.Interfaces.Prompt("prompt", audio);
new GUI.Element("div").setText("or choose from those below:");
new Components.Interfaces.Fretboard(audio);
new Components.Interfaces.Player(audio);
new Components.Data.Settings();
