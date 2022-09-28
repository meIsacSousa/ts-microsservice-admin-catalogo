import {
  CategoryRules,
  CategoryValidator,
  CategoryValidatorFactory,
} from "./category.validator";

describe("CategoryValidator tests", () => {
  let validator: CategoryValidator;

  beforeEach(() => {
    validator = CategoryValidatorFactory.create();
  });

  test("Invalidation cases for name field", () => {
    const asserts = [
      {
        props: null,
        errors: [
          "name should not be empty",
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      },
      {
        props: { name: "" },
        errors: ["name should not be empty"],
      },
      {
        props: { name: "a".repeat(256) },
        errors: ["name must be shorter than or equal to 255 characters"],
      },
      {
        props: { name: 1 },
        errors: [
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      },
      {
        props: { name: true },
        errors: [
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      },
    ];

    asserts.forEach((assert) => {
      expect({ validator, data: assert.props }).containsErrorMessages({
        name: assert.errors,
      });
    });
  });

  test("Valid cases for name field", () => {
    const asserts = [
      { props: { name: "a" } },
      { props: { name: "a".repeat(255) } },
    ];

    asserts.forEach(({ props }) => {
      expect(validator.validate(props as any)).toBeTruthy();
      expect(validator.errors).toBeNull();
      expect(validator.validatedData).toStrictEqual(new CategoryRules(props));
    });
  });

  test("Invalidation cases for description field", () => {
    const asserts = [
      {
        props: { description: 1 },
        errors: ["description must be a string"],
      },
      {
        props: { description: true },
        errors: ["description must be a string"],
      },
    ];

    asserts.forEach(({ props, errors }) => {
      expect({ validator, data: props }).containsErrorMessages({
        description: errors,
      });
    });
  });

  test("Valid cases for description field", () => {
    const asserts = [
      { props: { name: "valid", description: "a" } },
      { props: { name: "valid", description: "a".repeat(255) } },
      { props: { name: "valid", description: null } },
    ];

    asserts.forEach(({ props }) => {
      expect(validator.validate(props as any)).toBeTruthy();
      expect(validator.errors).toBeNull();
      expect(validator.validatedData).toStrictEqual(
        new CategoryRules(props as any)
      );
    });
  });

  test("Invalidation cases for is_active field", () => {
    const asserts = [
      {
        props: { is_active: 1 },
        errors: ["is_active must be a boolean value"],
      },
      {
        props: { is_active: "true" },
        errors: ["is_active must be a boolean value"],
      },
      {
        props: { is_active: 0 },
        errors: ["is_active must be a boolean value"],
      },
    ];

    asserts.forEach(({ props, errors }) => {
      expect({ validator, data: props }).containsErrorMessages({
        is_active: errors,
      });
    });
  });

  test("Valid cases for is_active field", () => {
    const asserts = [
      { props: { name: "valid", is_active: true } },
      { props: { name: "valid", is_active: false } },
      { props: { name: "valid", is_active: null } },
    ];

    asserts.forEach(({ props }) => {
      expect(validator.validate(props as any)).toBeTruthy();
      expect(validator.errors).toBeNull();
      expect(validator.validatedData).toStrictEqual(
        new CategoryRules(props as any)
      );
    });
  });

  test("Invalidation cases for created_at field", () => {
    const asserts = [
      {
        props: { created_at: 1 },
        errors: ["created_at must be a Date instance"],
      },
      {
        props: { created_at: "true" },
        errors: ["created_at must be a Date instance"],
      },
    ];

    asserts.forEach(({ props, errors }) => {
      expect({ validator, data: props }).containsErrorMessages({
        created_at: errors,
      });
    });
  });

  test("Valid cases for created_at field", () => {
    const asserts = [
      { props: { name: "valid", created_at: new Date() } },
      { props: { name: "valid", created_at: null } },
    ];

    asserts.forEach(({ props }) => {
      expect(validator.validate(props as any)).toBeTruthy();
      expect(validator.errors).toBeNull();
      expect(validator.validatedData).toStrictEqual(
        new CategoryRules(props as any)
      );
    });
  });
});
