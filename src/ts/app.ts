import '../scss/main.scss';
import { GUI_Element, GUI_Collection } from './app/gui';
import { App_Fretboard } from './app/app-parts';

let a = new GUI_Element<HTMLDivElement>("div", "note", "C1");
let b = new GUI_Element<HTMLDivElement>("div", "note", "D1");
let c = new GUI_Collection<HTMLDivElement>("div", "note-collection", null, [a, b]);
let d = new App_Fretboard();
let e = "s";


