import '../scss/main.scss';
import { Audio } from './audio';
import { Chord, Note } from './definitions';
import { GUI_Element, GUI_Collection } from './gui';
import { Tone } from 'tone';

let a = new GUI_Element<HTMLDivElement>("div", "note", "C1");
let b = new GUI_Element<HTMLDivElement>("div", "note", "D1");
let c = 
new GUI_Collection<HTMLDivElement>("div", "note-collection", null, null, a, b);



