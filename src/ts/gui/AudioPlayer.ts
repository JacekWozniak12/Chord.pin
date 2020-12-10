import { Chord } from "../definitions/Chord";
import { Audio } from "../parts/Audio";
import { Main } from "../parts/Communication";
import { ChordList } from "./ChordList";
import { GUI } from "./GUI";
import { SettingsDisplay } from "./SettingsDisplay";

export class Player extends GUI.Element<HTMLDivElement>{

    audio: Audio;
    chord : Chord;
    chordList : ChordList;
    main: Main;
    element_play: GUI.Element<HTMLButtonElement>;
    element_stop: GUI.Element<HTMLButtonElement>;
    element_settings: SettingsDisplay;

    constructor(main: Main, chordList : ChordList) {
        super();
        this.main = main;
        this.audio = main.audio;
        this.setup();
        this.getChordList(chordList);
    }

    private getChordList(chordList : ChordList)
    {
        if(this.chordList != null) 
            this.chordList.selectEvent.unsubscribe(this.setChord);

        this.chordList = chordList
        this.chordList?.selectEvent.subscribe(this.setChord);
    }

    private setup() {
        this.setupSettings();
        this.setupStop();
        this.setupPlay();
        this.parentElements([this.element_play, this.element_stop, this.element_settings]);
    }

    private setChord(chord : Chord)
    {
        this.chord = chord;
    }

    private setupSettings() {
        this.element_settings = new SettingsDisplay(this.main.options);
    }

    private setupPlay() {
        this.element_play = new GUI.Element("button", "play");
        this.element_play.addListener(
            "click", 
            e => this.audio.play(
                this.chord, 
                this.main.options));
    }

    private setupStop() {
        this.element_stop = new GUI.Element("button", "stop");
        this.element_stop.addListener("click", e => this.audio.stop());
    }
}