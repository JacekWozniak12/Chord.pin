import { GUI_Listener } from '../gui';
import { Chord } from '../definitions';
import { Audio } from '../audio';

export class app_player {

    el_play: GUI_Listener<HTMLDivElement>;
    audio: Audio;
    currentChord: Chord;

    constructor(audio: Audio) {
        this.el_play = new GUI_Listener("div", "icon", "", "body", "click", this.play.bind(this), "https://img.icons8.com/ios-glyphs/32/000000/play.png");
        this.audio = audio;
    }

    play() {
        this.audio.play(this.currentChord);
    }
}
