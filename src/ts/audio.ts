export class Audio{
    play(){
        var MonoSynth = require("tone").MonoSynth;
        var synth = new MonoSynth().toMaster();
        synth.triggerAttackRelease("C#4", "4n");
        synth.triggerRelease();
    }
}

