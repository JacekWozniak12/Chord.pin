import '../scss/main.scss';
import { Audio } from './audio';
import { app_prompt } from "./app/prompt";
import { app_player } from "./app/player";
import { app_fretboard } from "./app/fretboard";
import { GUI_Element} from './gui';

// init
const audio = new Audio();
audio.setup();
new GUI_Element("h1").setText("Chord.pin");
new app_prompt("prompt", audio);
new GUI_Element("div").setText("or choose from those below:");
new app_fretboard(audio);
new app_player(audio);
