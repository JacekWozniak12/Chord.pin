import { getTypeParameterOwner } from "typescript";

export module GUI {
    export class Element<T extends HTMLElement>{

        htmlElement: T;
        img: string;
        children: HTMLElement[];

        constructor(
            type: string = "div", className: string = null, id: string = null,
            parent: string = "body", img: string = null, trigger: string = null,
            f: EventListener = null
        ) {
            this.htmlElement = document.createElement(type) as T;
            this.setClassName(className).
                setId(id).addListener(trigger, f).
                setImage(type, img);

            this.children = [];
            if (parent == "" || parent == null) parent = "body";
            document.querySelector(parent).appendChild(this.htmlElement);
        }

        setId(id: string): this {
            if (id != "" && id != null) { this.htmlElement.id = id; }
            return this;
        }

        setClassName(className: string): this {
            if (className != "" && className != null) this.htmlElement.className = className;
            return this;
        }

        setImage(type: string, img: string): this {
            if (img != "" && img != null && img != undefined) {
                this.img = img;
                if (type == "img") this.htmlElement.setAttribute("src", this.img);

                else this.htmlElement.style.background = `url(${this.img})`;
            }
            return this;
        }

        clearParenting(): this {
            this.children.forEach(e => {
                this.htmlElement.removeChild(e);
            })
            this.children = null;
            return this;
        }

        parentElements(el: HTMLElement[]): this {
            el.forEach(e => {
                this.htmlElement.appendChild(e)
            });
            this.children = this.children.concat(el);
            return this;
        }

        setText(text: string): this {
            this.htmlElement.innerText = text;
            return this;
        }

        modifyAttribute(attribute: string, value: string) {
            this.htmlElement.setAttribute(attribute, value);
            return this;
        }

        addListener(trigger: string, f: EventListener): this {
            if (f != null && trigger != "" && trigger != null) {
                this.htmlElement.addEventListener(trigger, f);
            }
            return this;
        }

        delete() { this.htmlElement.remove(); }
    }

    export class InputElement<T extends HTMLInputElement> extends Element<T>{

        constructor(
            className: string = null, id: string = null,
            parent: string = "body", img: string = null,
            trigger: string = null, f: EventListener = null
        ) { super("input", className, id, parent, img, trigger, f); }

        getValue(): string { return this.htmlElement.value; }

        setValue(value: string): this {
            this.htmlElement.value = value;
            return this;
        }
    }
}


