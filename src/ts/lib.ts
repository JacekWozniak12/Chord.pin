export class Library{

    static checkStringForNull(value : string | null): boolean{
        return value != "" && value != null;
    }

    static clamp(value: number, min: number, max: number): number {
        if (value > max) value = max;
        if (value < min) value = min;
        return value;
    }
}
