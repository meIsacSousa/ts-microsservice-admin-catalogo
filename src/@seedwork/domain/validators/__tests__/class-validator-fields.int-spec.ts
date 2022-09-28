import { IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";
import { ValidatorFields } from "../class-validator-fields";

class StubRules {
  @MaxLength(25)
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  constructor(props: { name: string; price: number }) {
    Object.assign(this, props);
  }
}

class StubValidatorFields extends ValidatorFields<StubRules> {
  validate(data: any): boolean {
    return super.validate(new StubRules(data));
  }
}

describe("Class Validator Integration Tests", () => {
  it("Should validate with errors", () => {
    const validator = new StubValidatorFields();

    expect(validator.validate(null)).toBeFalsy();
    expect(validator.errors).toStrictEqual({
      name: [
        "name should not be empty",
        "name must be a string",
        "name must be shorter than or equal to 25 characters",
      ],
      price: [
        "price should not be empty",
        "price must be a number conforming to the specified constraints",
      ],
    });
  });

  it("Should be valide", () => {
    const validator = new StubValidatorFields();

    expect(validator.validate({ name: "name", price: 10 })).toBeTruthy();
    expect(validator.errors).toBeNull();
    expect(validator.validatedData).toStrictEqual(
      new StubRules({ name: "name", price: 10 })
    );
  });
});
