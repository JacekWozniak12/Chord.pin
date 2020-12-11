import { GUI } from "./GUI";
import { Chord } from "../definitions/Chord";
import { Notifier } from "../definitions/Observer";
import { Main } from "../parts/Communication";

export class ChordList extends GUI.Element<HTMLSelectElement>
{
    selectEvent : Notifier<Chord>;
    main : Main;

    constructor(main : Main)
    {
        super("select", "chordSelection");
        this.selectEvent = new Notifier<Chord>();
        
        this.main = main;
        this.update(this.main.chords.variable);
        this.main.chords.subscribe(this.update);
        this.select();
        this.html.onselect = e => this.select();
    }

    update(chords : Chord[])
    {
        this.clearParenting();
        chords.forEach(e => 
            {
                this.parentElements([e.createSelectable(this)]);
            })
    }

    select(chord : Chord = null)
    {
        if(chord == null)
        {
            this.selectEvent.notify(this.main.chords[this.html.selectedIndex]);
            console.log(this.main.chords[this.html.selectedIndex]);
        }
        else this.selectEvent.notify(chord);
    }
}