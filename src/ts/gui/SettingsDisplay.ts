import { GUI } from "../gui";
import { Options } from "../definitions/Options";


export class SettingsDisplay extends GUI.Element<HTMLElement> {

    el_title: GUI.Element<HTMLDivElement>;
    el_volume: GUI.Element<HTMLInputElement>;
    el_duration: GUI.Element<HTMLInputElement>;
    el_delay: GUI.Element<HTMLInputElement>;

    options: Options;

    constructor(options: Options, type: string = "div", className: string = "settings", id: string = null, parent: string = "body"
    ) {
        super(type, className, id, parent);

        if (options != null)
            this.options = options;
        else
            this.options = new Options();

        this.createVolume();
        this.createDuration();
        this.createDelay();

        this.el_delay.modifyAttribute("placeholder", `${this.options.getDelay()}`);
        this.el_duration.modifyAttribute("placeholder", `${this.options.getDuration()}`);

        this.setOptions(this.options);
    }

    notifyHandler(object: Object) {
        if (object instanceof Options) {
            this.setOptions(object);
        }
    }

    setOptions(options: Options): this {
        this.options.setValuesOf(options);
        this.el_volume.htmlElement.value = <any>this.options.getVolume();
        this.el_delay.htmlElement.value = <any>this.options.getDelay();
        this.el_duration.htmlElement.value = <any>this.options.getDuration();
        return this;
    }

    private updateVolume(): this {
        this.options.setVolume(this.el_volume.htmlElement.value);
        return this;
    }

    private updateDuration(): this {
        this.options.setDuration(this.el_duration.htmlElement.value);
        return this;
    }

    private updateDelay(): this {
        this.options.setDelay(this.el_delay.htmlElement.value);
        return this;
    }

    private createSettings(type: string, className: string, id: string, img: string): GUI.Element<HTMLElement> {
        let el_image = new GUI.Element("img").modifyAttribute("src", img);
        let el_settings = new GUI.Element(type, className, id);
        let el_container = new GUI.Element("div", "setting-container");
        el_container.parentElements([el_image.htmlElement, el_settings.htmlElement]);
        this.parentElements([el_container.htmlElement]);
        return el_settings;
    }

    private createDelay() {
        this.el_delay = <any>this.createSettings("input", "", "", "https://img.icons8.com/windows/32/000000/add-time.png").modifyAttribute("type", "number").modifyAttribute("min", "0").modifyAttribute("max", "10").modifyAttribute("step", "0.01").
            addListener("change", this.updateDelay.bind(this));
    }

    private createDuration() {
        this.el_duration = <any>this.createSettings("input", "", "", "https://img.icons8.com/windows/32/000000/time-slider.png").modifyAttribute("type", "number").modifyAttribute("min", "0").modifyAttribute("max", "10").modifyAttribute("step", "0.01").
            addListener("change", this.updateDuration.bind(this));
    }

    private createVolume() {
        this.el_volume = <any>this.createSettings("input", "", "", "https://img.icons8.com/windows/32/000000/speaker.png").
            modifyAttribute("type", "range").modifyAttribute("min", `0`).modifyAttribute("max", "1").modifyAttribute("step", "0.01").
            addListener("change", this.updateVolume.bind(this));
    }
}
