export class GUI_Element<T extends HTMLElement>{
    element: T;

    constructor(type: string, className: string, id: string = null)
    {
        this.element = document.createElement(type) as T;
        this.element.className = className;
        this.element.id = id;
        document.querySelector("body").appendChild(this.element);
    }
}

export class GUI_Collection<T extends HTMLElement> extends GUI_Element<T>{
    children: GUI_Element<T>[];

    constructor(type:string, className: string = null, id: string = null, children : GUI_Collection<T>[] = null, ...args : GUI_Element<T>[]){
        super(type, className, id);        
        this.appendChildren(args.concat(children));
    }

    private appendChildren(args: GUI_Element<T>[]) {
        this.children = args;
        this.children.forEach(child => {
            this.element.appendChild(child.element);
        });
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

}

