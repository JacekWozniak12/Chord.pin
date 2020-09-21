import '../scss/main.scss';
import { Audio } from './audio';
import { GUI } from './gui';
import { Main } from './communication';

const app = new GUI.Element("div", null, "chord.pin");
document.body.append(app.htmlElement);