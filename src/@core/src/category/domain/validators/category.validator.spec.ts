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

  describe("Invalidation cases for name field", () => {
    const arrange = [
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
    test.each(arrange)("validate %j", (arrange) => {
      expect({ validator, data: arrange.props }).containsErrorMessages({
        name: arrange.errors,
      });
    });
  });

  describe("Valid cases for name field", () => {
    const arrange = [
      { props: { name: "a" } },
      { props: { name: "a".repeat(255) } },
    ];

    test.each(arrange)("validate %j", ({ props }) => {
      expect(validator.validate(props as any)).toBeTruthy();
      expect(validator.errors).toBeNull();
      expect(validator.validatedData).toStrictEqual(new CategoryRules(props));
    });
  });

  describe("Invalidation cases for description field", () => {
    const arrange = [
      {
        props: { description: 1 },
        errors: ["description must be a string"],
      },
      {
        props: { description: true },
        errors: ["description must be a string"],
      },
    ];
    test.each(arrange)("validate %j", ({ props, errors }) => {
      expect({ validator, data: props }).containsErrorMessages({
        description: errors,
      });
    });
  });

  describe("Valid cases for description field", () => {
    const arrange = [
      { props: { name: "valid", description: "a" } },
      { props: { name: "valid", description: "a".repeat(255) } },
      { props: { name: "valid", description: null } },
    ];

    test.each(arrange)("validate %j", ({ props }) => {
      expect(validator.validate(props as any)).toBeTruthy();
      expect(validator.errors).toBeNull();
      expect(validator.validatedData).toStrictEqual(
        new CategoryRules(props as any)
      );
    });
  });

  describe("Invalidation cases for is_active field", () => {
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
    test.each(asserts)("validate %j", ({ props, errors }) => {
      expect({ validator, data: props }).containsErrorMessages({
        is_active: errors,
      });
    });
  });

  describe("Valid cases for is_active field", () => {
    const arrange = [
      { props: { name: "valid", is_active: true } },
      { props: { name: "valid", is_active: false } },
      { props: { name: "valid", is_active: null } },
    ];
    test.each(arrange)("validate %j", ({ props }) => {
      expect(validator.validate(props as any)).toBeTruthy();
      expect(validator.errors).toBeNull();
      expect(validator.validatedData).toStrictEqual(
        new CategoryRules(props as any)
      );
    });
  });

  describe("Invalidation cases for created_at field", () => {
    const arrange = [
      {
        props: { created_at: 1 },
        errors: ["created_at must be a Date instance"],
      },
      {
        props: { created_at: "true" },
        errors: ["created_at must be a Date instance"],
      },
    ];
    test.each(arrange)("validate %j", ({ props, errors }) => {
      expect({ validator, data: props }).containsErrorMessages({
        created_at: errors,
      });
    });
  });

  describe("Valid cases for created_at field", () => {
    const asserts = [
      { props: { name: "valid", created_at: new Date() } },
      { props: { name: "valid", created_at: null } },
    ];
    test.each(asserts)("validate %j", ({ props }) => {
      expect(validator.validate(props as any)).toBeTruthy();
      expect(validator.errors).toBeNull();
      expect(validator.validatedData).toStrictEqual(
        new CategoryRules(props as any)
      );
    });
  });
});
