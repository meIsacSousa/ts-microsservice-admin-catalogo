import UniqueEntityId from "../domain/value-objects/unique-entity-id.vo";
import Entity from "../domain/entity/entity";
import { InMemoryRepository } from "./in-memory.repository";

class StubEntityProps {
  name: string;
  price: number;
}

class StubEntity extends Entity<StubEntityProps> {}
class StubInMemoryRepository extends InMemoryRepository<StubEntity> {}

describe("InMemoryRepository Unit Tests", () => {
  let repository: StubInMemoryRepository;

  beforeEach(() => {
    repository = new StubInMemoryRepository();
  });

  it("Should insert an entity", async () => {
    const entity = new StubEntity({ name: "Test", price: 10 });
    await repository.insert(entity);
    expect(repository["entities"]).toStrictEqual([entity]);
  });

  it("Should throws an error when find by id with entity not found", async () => {
    const uuid = "b650511d-ab7d-49a8-97fd-a0d1253c8ff5";

    await expect(
      repository.findById(new UniqueEntityId(uuid))
    ).rejects.toThrowError(`Entity with id ${uuid} not found`);
    await expect(repository.findById("not-found")).rejects.toThrowError(
      "Entity with id not-found not found"
    );
  });

  it("Should finds an entity by id", async () => {
    const entity = new StubEntity({ name: "Test", price: 10 });
    await repository.insert(entity);

    let foundEntityByIdString = await repository.findById(entity.id);
    expect(foundEntityByIdString).toStrictEqual(entity);

    const foundEntityByIdVo = await repository.findById(entity.uniqueEntityId);
    expect(foundEntityByIdVo).toStrictEqual(entity);
  });

  it("Should returns all entities", async () => {
    const entity = new StubEntity({ name: "Test", price: 10 });
    const entity2 = new StubEntity({ name: "Test 2", price: 20 });
    await repository.insert(entity);
    await repository.insert(entity2);

    const entities = await repository.findAll();
    expect(entities).toStrictEqual([entity, entity2]);
  });

  it("Should throws an error on update with entity not found", async () => {
    const entity = new StubEntity({ name: "Test", price: 10 });

    await expect(repository.update(entity)).rejects.toThrowError(
      `Entity with id ${entity.id} not found`
    );
  });

  it("Should update an entity", async () => {
    const entity = new StubEntity({ name: "Test", price: 10 });
    await repository.insert(entity);

    const entityUpdated = new StubEntity(
      { name: "Test 2", price: 20 },
      entity.uniqueEntityId
    );
    await repository.update(entityUpdated);

    expect(repository["entities"]).toStrictEqual([entityUpdated]);
  });

  it("Should throws an error on delete with entity not found", async () => {
    const uuid = "b650511d-ab7d-49a8-97fd-a0d1253c8ff5";
    await expect(
      repository.delete(new UniqueEntityId(uuid))
    ).rejects.toThrowError(`Entity with id ${uuid} not found`);
    await expect(repository.delete(uuid)).rejects.toThrowError(
      `Entity with id ${uuid} not found`
    );
  });

  it("Should delete an entity", async () => {
    const entity = new StubEntity({ name: "Test", price: 10 });
    await repository.insert(entity);

    await repository.delete(entity.id);
    expect(repository["entities"]).toStrictEqual([]);
  });
});
