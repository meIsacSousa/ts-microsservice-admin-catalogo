import ValidatorRules from "./validator-rules";

// helpers
type ExpectedAssert = {
    value: any;
    property: string;
    rule: string;
    error: string;
    params?: any[];
}

function assertIsInvalid(assert: ExpectedAssert) {
    expect(() => {
        runRule(assert);
    }).toThrowError(assert.error);
}

function assertIsValid(assert: ExpectedAssert) {
    expect(() => {
        runRule(assert);
    }).not.toThrowError(assert.error);
}

function runRule({ value, property, rule, params = [] }: Omit<ExpectedAssert, "error">) {
    const validator = ValidatorRules.values(value, property);
    const method = validator[rule]
    method.apply(validator, params);
}

describe("Validations rules Unit Tests", () => {
    it("Should define the values of the validator properly", () => {
        const validator = ValidatorRules.values("value", "property");
        expect(validator).toBeInstanceOf(ValidatorRules);
        expect(validator["value"]).toBe("value");
        expect(validator["property"]).toBe("property");
    });

    it("Should throw an error when the value is required", () => {
        const asserts: ExpectedAssert[] = [
            { value: null as any, property: "propertyName", rule: "required", error: "The property propertyName is required" },
            { value: undefined as any, property: "propertyName", rule: "required", error: "The property propertyName is required" },
            { value: "", property: "propertyName", rule: "required", error: "The property propertyName is required" },
        ]

        asserts.forEach(assert => {
            assertIsInvalid(assert);
        });
    });

    it("Should not throw an error when the value is required", () => {
        const asserts: ExpectedAssert[] = [
            { value: 1, property: "propertyName", rule: "required", error: "The property propertyName is required" },
            { value: 0, property: "propertyName", rule: "required", error: "The property propertyName is required" },
            { value: false, property: "propertyName", rule: "required", error: "The property propertyName is required" },
            { value: true, property: "propertyName", rule: "required", error: "The property propertyName is required" },
            { value: "text", property: "propertyName", rule: "required", error: "The property propertyName is required" },
            { value: { prop: "prop" }, property: "propertyName", rule: "required", error: "The property propertyName is required" },
        ]

        asserts.forEach(assert => {
            assertIsValid(assert);
        });
    });

    it("Should throw an error when the value is not a string", () => {
        const asserts: ExpectedAssert[] = [
            { value: 1, property: "propertyName", rule: "string", error: "The property propertyName must be a string" },
            { value: 0, property: "propertyName", rule: "string", error: "The property propertyName must be a string" },
            { value: false, property: "propertyName", rule: "string", error: "The property propertyName must be a string" },
            { value: true, property: "propertyName", rule: "string", error: "The property propertyName must be a string" },
            { value: { prop: "prop" }, property: "propertyName", rule: "string", error: "The property propertyName must be a string" },
        ]

        asserts.forEach(assert => {
            assertIsInvalid(assert);
        });
    });

    it("Should not throw an error when the value is a string", () => {
        const asserts: ExpectedAssert[] = [
            { value: "", property: "propertyName", rule: "string", error: "The property propertyName must be a string" },
            { value: "text", property: "propertyName", rule: "string", error: "The property propertyName must be a string" },
            { value: null, property: "propertyName", rule: "string", error: "The property propertyName must be a string" },
            { value: undefined, property: "propertyName", rule: "string", error: "The property propertyName must be a string" },
        ]

        asserts.forEach(assert => {
            assertIsValid(assert);
        });
    });

    it("Should throw an error when the value is greater than max length", () => {
        const asserts: ExpectedAssert[] = [
            { value: "greater than", property: "propertyName", rule: "maxLength", error: "The property propertyName must be less than or equal to 3 characters.", params: [3] },
            { value: "bigger", property: "propertyName", rule: "maxLength", error: "The property propertyName must be less than or equal to 4 characters.", params: [4] },
        ]

        asserts.forEach(assert => {
            assertIsInvalid(assert);
        });
    });

    it("Should not throw an error when the value is less than or equal to max length", () => {
        const asserts: ExpectedAssert[] = [
            { value: "equal", property: "propertyName", rule: "maxLength", error: "The property propertyName must be less than or equal to 5 characters.", params: [5] },
            { value: "less", property: "propertyName", rule: "maxLength", error: "The property propertyName must be less than or equal to 6 characters.", params: [6] },
            { value: null, property: "propertyName", rule: "maxLength", error: "The property propertyName must be less than or equal to 6 characters.", params: [6] },
            { value: undefined, property: "propertyName", rule: "maxLength", error: "The property propertyName must be less than or equal to 6 characters.", params: [6] },
        ]

        asserts.forEach(assert => {
            assertIsValid(assert);
        });
    });

    it("Should throw an error when the value isn't boolean", () => {
        const asserts: ExpectedAssert[] = [
            { value: 1, property: "propertyName", rule: "boolean", error: "The property propertyName must be a boolean" },
            { value: 0, property: "propertyName", rule: "boolean", error: "The property propertyName must be a boolean" },
            { value: "text", property: "propertyName", rule: "boolean", error: "The property propertyName must be a boolean" },
            { value: "true", property: "propertyName", rule: "boolean", error: "The property propertyName must be a boolean" },
            { value: "false", property: "propertyName", rule: "boolean", error: "The property propertyName must be a boolean" },
            { value: { prop: "prop" }, property: "propertyName", rule: "boolean", error: "The property propertyName must be a boolean" },
        ]

        asserts.forEach(assert => {
            assertIsInvalid(assert);
        });
    });

    it("Should not throw an error when the value is boolean", () => {
        const asserts: ExpectedAssert[] = [
            { value: false, property: "propertyName", rule: "boolean", error: "The property propertyName must be a boolean" },
            { value: true, property: "propertyName", rule: "boolean", error: "The property propertyName must be a boolean" },
            { value: null, property: "propertyName", rule: "boolean", error: "The property propertyName must be a boolean" },
            { value: undefined, property: "propertyName", rule: "boolean", error: "The property propertyName must be a boolean" },
        ]

        asserts.forEach(assert => {
            assertIsValid(assert);
        });
    });

    it("Should throw an error when combine required and string", () => {
        const asserts: ExpectedAssert[] = [
            { value: null, property: "propertyName", rule: "required", error: "The property propertyName is required" },
            { value: undefined, property: "propertyName", rule: "required", error: "The property propertyName is required" },
            { value: "", property: "propertyName", rule: "required", error: "The property propertyName is required" },
            { value: 1, property: "propertyName", rule: "string", error: "The property propertyName must be a string" },
            { value: true, property: "propertyName", rule: "string", error: "The property propertyName must be a string" },
            { value: { prop: "a" }, property: "propertyName", rule: "string", error: "The property propertyName must be a string" },
        ]

        asserts.forEach(assert => {
            expect(() => ValidatorRules.values(assert.value, assert.property).required().string())
                .toThrowError(assert.error);
        });
    });

    it("Should not throw an error when combine required and string", () => {
        const asserts: ExpectedAssert[] = [
            { value: "text", property: "propertyName", rule: "required", error: "The property propertyName is required" },
            { value: "text", property: "propertyName", rule: "string", error: "The property propertyName must be a string" },
        ]

        asserts.forEach(assert => {
            expect(() => ValidatorRules.values(assert.value, assert.property).required().string())
                .not.toThrowError(assert.error);
        });
    });

    it("Should throw an error when combine required, string and maxLength", () => {
        const asserts: ExpectedAssert[] = [
            { value: null, property: "propertyName", rule: "required", error: "The property propertyName is required" },
            { value: undefined, property: "propertyName", rule: "required", error: "The property propertyName is required" },
            { value: "", property: "propertyName", rule: "required", error: "The property propertyName is required" },
            { value: 1, property: "propertyName", rule: "string", error: "The property propertyName must be a string" },
            { value: true, property: "propertyName", rule: "string", error: "The property propertyName must be a string" },
            { value: { prop: "a" }, property: "propertyName", rule: "string", error: "The property propertyName must be a string" },
            { value: "greater than", property: "propertyName", rule: "maxLength", error: "The property propertyName must be less than or equal to 3 characters.", params: [3] },
            { value: "bigger", property: "propertyName", rule: "maxLength", error: "The property propertyName must be less than or equal to 4 characters.", params: [4] },
        ]

        asserts.forEach(assert => {
            expect(() => ValidatorRules.values(assert.value, assert.property).required().string().maxLength(assert.params[0]))
                .toThrowError(assert.error);
        });
    });


    it("Should not throw an error when combine required, string and maxLength", () => {
        const asserts: ExpectedAssert[] = [
            { value: "text", property: "propertyName", rule: "required", error: "The property propertyName is required" },
            { value: "text", property: "propertyName", rule: "string", error: "The property propertyName must be a string" },
            { value: "text", property: "propertyName", rule: "maxLength", error: "The property propertyName must be less than or equal to 5 characters.", params: [5] },
        ]

        asserts.forEach(assert => {
            expect(() => ValidatorRules.values(assert.value, assert.property).required().string().maxLength(assert.params[0]))
                .not.toThrowError(assert.error);
        });
    });

    it("Should throw an error when combine required, boolean", () => {
        const asserts: ExpectedAssert[] = [
            { value: null, property: "propertyName", rule: "required", error: "The property propertyName is required" },
            { value: undefined, property: "propertyName", rule: "required", error: "The property propertyName is required" },
            { value: "", property: "propertyName", rule: "required", error: "The property propertyName is required" },
            { value: 1, property: "propertyName", rule: "boolean", error: "The property propertyName must be a boolean" },
            { value: "true", property: "propertyName", rule: "boolean", error: "The property propertyName must be a boolean" },
            { value: { prop: "a" }, property: "propertyName", rule: "boolean", error: "The property propertyName must be a boolean" },
        ]

        asserts.forEach(assert => {
            expect(() => ValidatorRules.values(assert.value, assert.property).required().boolean())
                .toThrowError(assert.error);
        });
    });

    it("Should not throw an error when combine required, boolean", () => {
        const asserts: ExpectedAssert[] = [
            { value: false, property: "propertyName", rule: "required", error: "The property propertyName is required" },
            { value: true, property: "propertyName", rule: "required", error: "The property propertyName is required" },
            { value: false, property: "propertyName", rule: "boolean", error: "The property propertyName must be a boolean" },
            { value: true, property: "propertyName", rule: "boolean", error: "The property propertyName must be a boolean" },
        ]

        asserts.forEach(assert => {
            expect(() => ValidatorRules.values(assert.value, assert.property).required().boolean())
                .not.toThrowError(assert.error);
        });
    });
});