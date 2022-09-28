import { ValueObject } from "../value-object";

class StubValueObject extends ValueObject {}

// mock - instância fake de uma classe
// spy  - função que observa se uma função foi chamada
// stub - instância substituta de uma classe

describe("ValueObject Unit Tests", () => {
  it("Should set value", () => {
    let vo = new StubValueObject("value");
    expect(vo.value).toBe("value");

    vo = new StubValueObject({
      prop: "value",
    });

    expect(vo.value).toStrictEqual({
      prop: "value",
    });
  });

  it("Should convert to a string", () => {
    const date = new Date();
    let arrange = [
      { value: "value", expected: "value" },
      { value: 1, expected: "1" },
      { value: { prop: "value" }, expected: '{"prop":"value"}' },
      { value: null, expected: "null" },
      { value: undefined, expected: "undefined" },
      { value: true, expected: "true" },
      { value: "", expected: "" },
      { value: date, expected: date.toString() },
    ];

    arrange.forEach((item) => {
      let vo = new StubValueObject(item.value);
      expect(vo + "").toBe(item.expected);
    });
  });

  it("Should be a immutable object", () => {
    const vo = new StubValueObject({
      prop1: "value",
      deep: {
        prop2: "value",
        prop3: new Date(),
      },
    });

    expect(() => (vo.value.prop1 = "new value")).toThrow(
      "Cannot assign to read only property 'prop1' of object '#<Object>'"
    );
    expect(() => (vo.value.deep.prop2 = "new value")).toThrow(
      "Cannot assign to read only property 'prop2' of object '#<Object>'"
    );
    expect(vo.value.deep.prop3).toBeInstanceOf(Date);
  });
});
