import { ValidatorFields } from "../validators/class-validator-fields";
import { FieldsErrors } from "../validators/validator-fields-interface";
import { EntityValidationError } from "#seedwork/domain";

type Expected =
  | {
      validator: ValidatorFields<any>;
      data: any;
    }
  | (() => any);

expect.extend({
  containsErrorMessages(expected: Expected, received: FieldsErrors) {
    if (typeof expected === "function") {
      try {
        expected();
        return {
          pass: false,
          message: () => "Expected function to throw an error",
        };
      } catch (err) {
        const error = err as EntityValidationError;
        return match(received, error.errors);
      }
    }

    const { validator, data } = expected;
    const isValid = validator.validate(data);
    if (isValid) {
      return {
        message: () => `expected ${data} to be invalid`,
        pass: false,
      };
    }
    return match(validator.errors, received);
  },
});

function match(expected: FieldsErrors, received: FieldsErrors) {
  const isMatch = expect.objectContaining(received).asymmetricMatch(expected);
  return isMatch
    ? {
        pass: true,
        message: () => "",
      }
    : {
        pass: false,
        message: () =>
          `Expected: ${JSON.stringify(expected)}, Received: ${JSON.stringify(
            received
          )}`,
      };
}
