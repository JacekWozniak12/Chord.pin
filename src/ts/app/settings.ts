import { GUI_Element } from '../gui';
import { Options } from '../definitions';

export class app_settings {
    el_main: GUI_Element<HTMLDivElement>;
    el_title: GUI_Element<HTMLDivElement>;
    el_volume: GUI_Element<HTMLInputElement>;
    el_duration: GUI_Element<HTMLInputElement>;
    el_delay: GUI_Element<HTMLInputElement>;

    currentModifiedOptions: Options;

    constructor() {

        this.el_main = new GUI_Element("div", "settings");
        this.createSettingsTitle();
        this.createVolume();
        this.createDuration();
        this.createDelay();
    }


    private createSettingsTitle(title: string = "settings") {
        this.el_title = new GUI_Element("div", "", "");
        this.el_title.element.textContent = title;
        this.el_main.parentElements([this.el_title.element]);
    }

    setOption(options: Options, title: string) {
        this.currentModifiedOptions = options;
        this.el_title.element.textContent = title;
    }

    unsetOption() {
        this.currentModifiedOptions = null;
        // null everything
        this.el_main.element.classList.toggle("hidden");
    }


    private createSetting(type: string, className: string, id: string, img: string): GUI_Element<HTMLElement> {
        let i = new GUI_Element("img").modifyAttribute("src", img);
        let r = new GUI_Element(type, className, id);
        let u = new GUI_Element("div", "setting-container");
        u.parentElements([i.element, r.element]);
        this.el_main.parentElements([u.element]);
        return r;
    }


    private createDelay() {
        this.el_delay = <any>this.createSetting("input", "", "", "https://img.icons8.com/windows/32/000000/add-time.png").
            modifyAttribute("placeholder", "00").
            modifyAttribute("type", "number").
            modifyAttribute("min", "0").
            modifyAttribute("max", "10");
    }


    private createDuration() {
        this.el_duration = <any>this.createSetting("input", "", "", "https://img.icons8.com/windows/32/000000/time-slider.png").
            modifyAttribute("placeholder", "01").
            modifyAttribute("type", "number").
            modifyAttribute("min", "0").
            modifyAttribute("max", "10");
    }


    private createVolume() {
        this.el_volume = <any>this.createSetting("input", "", "", "https://img.icons8.com/windows/32/000000/speaker.png").
            modifyAttribute("type", "range").
            modifyAttribute("min", "0").
            modifyAttribute("max", "1").
            modifyAttribute("step", "0.01");
    }
}
