import UniqueEntityId from "@seedwork/domain/value-objects/unique-entity-id.vo";
import Entity from "../domain/entity/entity";

export interface RepositoryInterface<E extends Entity> {
    findAll(): Promise<E[]>;
    findById(id: string | UniqueEntityId): Promise<E>;
    insert(entity: E): Promise<void>;
    update(entity: E): Promise<void>;
    delete(id: string | UniqueEntityId): Promise<void>;
}