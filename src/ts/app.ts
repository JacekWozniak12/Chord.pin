import '../scss/main.scss';
import { Audio } from './audio';
import {  } from './gui';
import { Chord, Note } from './definitions';



let A = new Audio().setup();

A.play(new Chord([
    new Note("C3"), new Note("C4")
]));

