import UniqueEntityId from "../domain/value-objects/unique-entity-id.vo";
import Entity from "../domain/entity/entity";
import { RepositoryInterface } from "./repository-contracts";
import NotFoundError from "../errors/not-found.error";

export default abstract class InMemoryRepository<E extends Entity>
    implements RepositoryInterface<E> {
    protected entities: E[] = [];

    public async findAll(): Promise<E[]> {
        return this.entities;
    }

    public async findById(id: string | UniqueEntityId): Promise<E> {
        const _id = `${id}`;
        return this._get(_id);
    }

    public async insert(entity: E): Promise<void> {
        this.entities.push(entity);
    }

    public async update(entity: E): Promise<void> {
        await this._get(entity.id);
        const index = this.entities.findIndex((e) => e.id === entity.id);
        this.entities[index] = entity;
    }

    public async delete(id: string | UniqueEntityId): Promise<void> {
        const _id = `${id}`;
        await this._get(_id);
        this.entities = this.entities.filter((entity) => entity.id !== _id);
    }

    protected async _get(id: string): Promise<E> {
        const entity = this.entities.find((entity) => entity.id === id);
        if (!entity) {
            throw new NotFoundError(`Entity with id ${id} not found`);
        }
        return entity;
    }
}