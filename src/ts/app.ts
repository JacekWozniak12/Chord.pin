import '../scss/main.scss';
import { Audio } from './audio';
import { Components as C} from "./components"
import { GUI as G } from './gui';

// init
const audio = new Audio();
audio.setup();

const container = new G.Element("div", "", "chord-pin")
.parentElements(
[
    new G.Element("h1").setText("Chord.pin").htmlElement,
    new C.Interfaces.Prompt("prompt", audio).htmlElement,
    new G.Element("div").setText("or choose from those below:").htmlElement,
    new C.Interfaces.Fretboard(audio).htmlElement,
    new C.Interfaces.Player(audio).htmlElement,
    new C.Data.Settings().htmlElement
]
)





// destroy 
window.addEventListener("beforeunload", audio.dispose);