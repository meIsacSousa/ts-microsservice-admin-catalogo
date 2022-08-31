import InvalidUuidError from "../errors/invalid-uuid.error";
import { v4 as randomUUID, validate } from "uuid";

export default class UniqueEntityId {
  constructor(public readonly id?: string) {
    this.id = id ?? randomUUID();
    this.validate();
  }

  private validate(): void {
    const isValid = validate(this.id);
    if (!isValid) {
      throw new InvalidUuidError();
    }
  }
}
