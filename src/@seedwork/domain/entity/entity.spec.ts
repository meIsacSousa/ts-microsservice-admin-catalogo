import UniqueEntityId from "../value-objects/unique-entity-id.vo";
import { validate as uuidValidate } from "uuid";
import Entity from "./entity";

class StubEntity extends Entity<{ name: string, age: number }> { };

describe("Entity Unit Tests", () => {
    it("Should set props and id", () => {
        const arrange = { name: "test", age: 10 };
        const entity = new StubEntity(arrange);

        expect(entity.props).toStrictEqual(arrange);
        expect(entity.uniqueEntityId).toBeInstanceOf(UniqueEntityId);
        expect(entity.id).not.toBeNull();
        expect(uuidValidate(entity.id)).toBeTruthy();
    });

    it("Should accept a valid uuid", () => {
        const arrange = { name: "test", age: 10 };
        const id = "e3f1d9e2-2a3e-4d5b-9d0f-1d6f5e7d8f9a";
        const entity = new StubEntity(arrange, new UniqueEntityId(id));

        expect(entity.props).toStrictEqual(arrange);
        expect(entity.uniqueEntityId).toBeInstanceOf(UniqueEntityId);
        expect(entity.id).toBe(id);
        expect(uuidValidate(entity.id)).toBeTruthy();
    });

    it("Should convert an entity to json", () => {
        const arrange = { name: "test", age: 10 };
        const entity = new StubEntity(arrange);

        expect(entity.toJSON()).toStrictEqual({
            id: entity.id,
            ...arrange,
        });
    });
});