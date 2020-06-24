export class GUI_Element<T extends HTMLElement>{
    element: T;

    constructor(type: string, className: string, id: string = null, parent: string = "body")
    {
        this.element = document.createElement(type) as T;
        this.element.className = className;
        this.element.id = id;
        document.querySelector(parent).appendChild(this.element);
    }
}

export class GUI_Selector<T extends HTMLElement> extends GUI_Element<T>
{
    toFind: string;

    constructor(type:string, toFind: string, className: string = null, id: string = null){
        super(type, className, id);
        this.toFind = toFind;

    }
}

export class GUI_Button<T extends HTMLElement> extends GUI_Element<T>
{
    event: Event

    constructor(type: string, className: string, id: string = null, parent: string = "body")
    {
        super(type, className, id, parent);

    }
}

