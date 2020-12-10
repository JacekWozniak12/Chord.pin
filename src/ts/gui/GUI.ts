export module GUI {
    export class Element<T extends HTMLElement>{

        html: T;
        img: string;
        children: HTMLElement[];

        constructor(
            type: string = "div", 
            className: string = null, 
            id: string = null,
            parent: string = "body", 
            img: string = null
        ) {
            this.html = document.createElement(type) as T;
            this.setClassName(className).setId(id).setImage(type, img);

            this.children = [];
            if (parent == "" || parent == null) parent = "body";
            document.querySelector(parent).appendChild(this.html);
        }

        setId(id: string): this {
            if (id != "" && id != null) { this.html.id = id; }
            return this;
        }

        setClassName(className: string): this {
            if (className != "" && className != null) this.html.className = className;
            return this;
        }

        setImage(type: string, img: string): this {
            if (img != "" && img != null && img != undefined) {
                this.img = img;
                if (type == "img") this.html.setAttribute("src", this.img);
                else this.html.style.background = `url(${this.img})`;
            }
            return this;
        }

        clearParenting(): this {
            this.children.forEach(e => {
                this.html.removeChild(e);
            })
            this.children = null;
            return this;
        }

        parentElements(el: HTMLElement[] | GUI.Element<HTMLElement>[]): this {
            let array = new Array<HTMLElement>();

            if (el[0] instanceof Element) {
                el = el as Element<HTMLElement>[];
                el.forEach(e => { this.html.appendChild(e.html); })
            }
            else array = el as Array<HTMLElement>;

            array.forEach(e => { this.html.appendChild(e) });
            this.children = this.children.concat(array);
            return this;
        }

        setText(text: string): this {
            this.html.innerText = text;
            return this;
        }

        modifyAttribute(attribute: string, value: string) {
            this.html.setAttribute(attribute, value);
            return this;
        }

        addListener(trigger: string, f: EventListener): this {
            if (f != null && trigger != "" && trigger != null) {
                this.html.addEventListener(trigger, f);
            }
            return this;
        }

        delete() { this.html.remove(); }
    }

    export class InputElement<T extends HTMLInputElement> extends Element<T>{
        constructor(
            className: string = null, id: string = null,
            parent: string = "body", img: string = null

        ) { super("input", className, id, parent, img); }

        getValue(): string { return this.html.value; }

        setValue(value: string): this {
            this.html.value = value;
            return this;
        }
    }
}


