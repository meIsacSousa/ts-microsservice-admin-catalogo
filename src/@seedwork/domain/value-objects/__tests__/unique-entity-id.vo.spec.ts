import InvalidUuidError from "../../../errors/invalid-uuid.error";
import UniqueEntityId from "../unique-entity-id.vo";
import { validate } from "uuid";

describe("UniqueEntityId Unit Tests", () => {
  const validateSpy = jest.spyOn(UniqueEntityId.prototype as any, "validate");

  it("Should throw an error when uuid is invalid", () => {
    expect(() => new UniqueEntityId("invalid-uuid")).toThrow(
      new InvalidUuidError()
    );
    expect(validateSpy).toBeCalledTimes(1);
  });

  it("Should create an unique entity id when a valid id is passed", () => {
    const id = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";
    const uniqueEntityId = new UniqueEntityId(id);

    expect(validateSpy).toBeCalledTimes(1);
    expect(uniqueEntityId.value).toBe(id);
  });

  it("Should create an unique entity id when nothing is passed", () => {
    const uniqueEntityId = new UniqueEntityId();

    expect(validateSpy).toBeCalledTimes(1);
    expect(validate(uniqueEntityId.value)).toBeTruthy();
  });
});
