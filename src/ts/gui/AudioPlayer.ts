import { Chord } from "../definitions/Chord";
import { Options } from "../definitions/Options";
import { Audio } from "../parts/Audio";
import { Main } from "../parts/Communication";
import { ChordList } from "./ChordList";
import { GUI } from "./GUI";
import { SettingsDisplay } from "./SettingsDisplay";

export class Player extends GUI.Element<HTMLDivElement>{

    audio: Audio;
    current_chord : Chord;
    main: Main;
    
    element_play: GUI.Element<HTMLButtonElement>;
    element_stop: GUI.Element<HTMLButtonElement>;
    element_chordList : ChordList;
    element_settings: SettingsDisplay;

    constructor(main: Main, chordList : ChordList) {
        super();
        this.main = main;
        this.audio = new Audio();
        this.setup();
        this.getChordList(chordList);
    }

    private getChordList(chordList : ChordList)
    {
        if(this.element_chordList != null) 
            this.element_chordList.selectEvent.unsubscribe(this.setChord);

        this.element_chordList = chordList
        this.element_chordList?.selectEvent.subscribe(this.setChord);
    }

    private setup() {
        this.setupSettings();
        this.setupStop();
        this.setupPlay();
        this.parentElements([this.element_play, this.element_stop, this.element_settings]);
    }

    private setChord(chord : Chord)
    {
        this.current_chord = chord;
    }

    private setupSettings() {
        console.log(this.main.options.variable);
        this.element_settings = new SettingsDisplay(this.main.options.variable);
    }

    private setupPlay() {
        this.element_play = new GUI.Element("button", "play");
        this.element_play.addListener(
            "click", 
            e => this.audio.play(
                this.current_chord, 
                this.main.options.variable));
    }

    private setupStop() {
        this.element_stop = new GUI.Element("button", "stop");
        this.element_stop.addListener("click", e => this.audio.stop());
    }
}