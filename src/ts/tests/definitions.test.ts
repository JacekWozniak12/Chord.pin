import { Note } from "../app/definitions"

describe("Note isValidName", () => {
    
    it("isValidName", () =>
    {
        const a = new Note("C#3");
        expect((a.isValidName("C#3"))).toBe(true);   
    }),
    
    it("invalid Construction", () =>
    {
        expect(() => new Note("a")).toThrow("Invalid note name");
    })
})