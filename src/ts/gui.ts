export module GUI {

    class Element<T extends HTMLElement>{

        htmlElement: T;
        img: string;

        constructor(
            type: string,
            className: string = null,
            id: string = null,
            parent: string = "body",
            img: string = null,
            trigger: string = null,
            f: EventListener = null
        ) {
            this.htmlElement = document.createElement(type) as T;
            this.setClassName(className);
            this.setId(id);
            this.addListener(trigger, f);
            this.setImage(type, img);
            document.querySelector(parent).appendChild(this.htmlElement);
        }


        private setId(id: string) {
            if (id != "" && id != null)
                this.htmlElement.id = id;
        }

        private setClassName(className: string) {
            if (className != "" && className != null)
                this.htmlElement.className = className;
        }

        setImage(type: string, img: string): void {
            if (img != "") {
                this.img = img;
                if (type == "img") {
                    this.htmlElement.setAttribute("src", this.img);
                }
                else
                    this.htmlElement.style.background = `url(${this.img})`;
            }
        }

        parentElements(el: HTMLElement[]) {
            el.forEach(e => { this.htmlElement.appendChild(e) });
        }

        setText(text: string) {
            this.htmlElement.innerText = text;
        }

        modifyAttribute(attribute: string, value: string){
            this.htmlElement.setAttribute(attribute, value);
            return this;
        }

        addListener(trigger: string, f: EventListener) {
            if (f != null && trigger != "" && trigger != null) {
                this.htmlElement.addEventListener(trigger, f);
            }
        }
    }
}


