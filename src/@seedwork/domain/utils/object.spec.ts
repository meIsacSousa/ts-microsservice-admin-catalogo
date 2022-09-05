import { deepFreeze } from "./object";

describe("Object Unit Tests", () => {
    it("Should be a immutable object", () => {
        const obj = deepFreeze({
            prop: "value", deep: {
                prop: "value",
                prop2: new Date(),
            }
        });

        expect(() => (obj as any).prop = "new value")
            .toThrow("Cannot assign to read only property 'prop' of object '#<Object>'");
        expect(() => (obj as any).deep.prop2 = "new value")
            .toThrow("Cannot assign to read only property 'prop2' of object '#<Object>'");
        expect(obj.deep.prop2).toBeInstanceOf(Date);
    });

    it("Should not freeze a scalar value", () => {
        let str = deepFreeze("string");
        expect(typeof str).toBe("string");
        expect(str).toBe("string");
        str = deepFreeze("new string");
        expect(typeof str).toBe("string");
        expect(str).toBe("new string");


        let num = deepFreeze(1);
        expect(typeof num).toBe("number");
        expect(num).toBe(1);
        num = deepFreeze(2);
        expect(typeof num).toBe("number");
        expect(num).toBe(2);

        let boolean = deepFreeze(true);
        expect(typeof boolean).toBe("boolean");
        expect(boolean).toBeTruthy();

        boolean = deepFreeze(false);
        expect(typeof boolean).toBe("boolean");
        expect(boolean).toBeFalsy();
    });
});