import ValueObject from "../value-object";

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
});
