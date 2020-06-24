export class GUI_Element<T extends HTMLElement>{
    element: T;

    constructor(type: string, className: string = null, id: string = null, parent: string = "body")
    {
        this.element = document.createElement(type) as T;
        if(className != "" && className != null) this.element.className = className;
        if(id != "" && id != null) this.element.id = id;
        document.querySelector(parent).appendChild(this.element);
    }

    parentElements(el : HTMLElement[]){
        el.forEach(e => {this.element.appendChild(e)});
    }

    setText(text : string){
        this.element.innerText = text;
    }

    modifyAttribute(attribute: string, value: string) : GUI_Element<T>{
        this.element.setAttribute(attribute, value);
        return this;
    }
}

export class GUI_Listener<T extends HTMLElement> extends GUI_Element<T>
{
    img: string;

    constructor(type: string, className: string = null, id: string = null, parent: string = "body", trigger: string, f : EventListener, img :string="")
    {
        super(type, className, id, parent);
        if(img != ""){
            this.img = img;
            this.setImage(type);
        }
        if(f != null && trigger != ""){
            this.addListener(trigger, f);
        }      
    }

    setImage(type: string) : void {
        if (type = "img") {
            this.element.setAttribute("src", this.img);
        }
        else
            this.element.style.background = `url(${this.img})`;
    }

    addListener(trigger: string, f: EventListener ){
        this.element.addEventListener(trigger, f);
    }


}

