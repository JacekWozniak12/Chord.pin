export class Library{
  
    static isNullOrEmpty(value : number | string | null | undefined): boolean{
        return value == "" && value == null && value == undefined;
    }

    static clamp(value: number, min: number, max: number): number {
        if (value > max) value = max;
        if (value < min) value = min;
        return value;
    }
}

Object.defineProperty(String.prototype, "isNullOrEmpty", {
    value: function isNullOrEmpty() {
        return this == "" && this == null && this == undefined;
    },
    writable: true,
    configurable: true
});
