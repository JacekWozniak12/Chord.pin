import { Note } from "../definitions"

describe("Note isValidName", () => {
    
    const validConstructors = ["C#3", "Bb4"];

    it.each(validConstructors)("isValidName %s", (t) =>
    {
        const a = new Note(t);
        expect((a.isValidName(t))).toBe(true);   
    });
    
    const invalidConstructors = ["c", "Z#4", "Ą3", "0ad"];
    
    it.each(invalidConstructors)("invalid Construction %s", (t) =>
    {
        expect(() => new Note(t)).toThrow("Invalid note name");
    });
})