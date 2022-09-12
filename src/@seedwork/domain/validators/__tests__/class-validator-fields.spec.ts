import ValidatorFields from "../class-validator-fields";
import * as libClassValidator from "class-validator";

class StubValidatorFields extends ValidatorFields<{ field: string }> { }

describe("Validator Fields Unit Tests", () => {
    it("Should start with errors and dataValidated as null", () => {
        const validator = new StubValidatorFields();
        expect(validator.errors).toBeNull();
        expect(validator.validatedData).toBeNull();
    });

    it("Should validate with errors", () => {
        const spyValidateSync = jest.spyOn(libClassValidator, "validateSync");
        spyValidateSync.mockReturnValue([{ property: "field", constraints: { required: "required" } }]);

        const validator = new StubValidatorFields();
        const isValid = validator.validate({ field: "value" });

        expect(spyValidateSync).toBeCalledTimes(1);
        expect(isValid).toBeFalsy();
        expect(validator.validatedData).toBeNull();
        expect(validator.errors).toEqual({ field: ["required"] });
    });

    it("Should validate without errors", () => {
        const spyValidateSync = jest.spyOn(libClassValidator, "validateSync");
        spyValidateSync.mockReturnValue([]);

        const validator = new StubValidatorFields();
        const isValid = validator.validate({ field: "value" });

        expect(spyValidateSync).toBeCalledTimes(1);
        expect(isValid).toBeTruthy();
        expect(validator.errors).toBeNull();
        expect(validator.validatedData).toEqual({ field: "value" });
    });
});