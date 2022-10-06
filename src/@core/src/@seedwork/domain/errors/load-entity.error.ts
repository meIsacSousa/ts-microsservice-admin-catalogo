import { FieldsErrors } from "../validators";

export class LoadEntityError extends Error {
  constructor(public errors: FieldsErrors, message?: string) {
    super(message ?? "Entity could not be loaded");
    this.name = "LoadEntityError";
  }
}
