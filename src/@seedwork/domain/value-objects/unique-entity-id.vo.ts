import InvalidUuidError from "../../errors/invalid-uuid.error";
import { v4 as randomUUID, validate } from "uuid";
import ValueObject from "./value-object";

export default class UniqueEntityId extends ValueObject<string> {
  constructor(id?: string) {
    super(id ?? randomUUID());
    this.validate();
  }

  private validate(): void {
    const isValid = validate(this.value);
    if (!isValid) {
      throw new InvalidUuidError();
    }
  }
}