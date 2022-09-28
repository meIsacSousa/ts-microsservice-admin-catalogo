import { UniqueEntityId } from "../value-objects";
import { Entity } from "../entity";
import {
  RepositoryInterface,
  SearchableRepositoryInterface,
  SearchParams,
  SearchResult,
  SortDirection,
} from "./repository-contracts";
import { NotFoundError } from "../errors";

export abstract class InMemoryRepository<E extends Entity>
  implements RepositoryInterface<E>
{
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

export abstract class InMemorySearchableRepository<E extends Entity>
  extends InMemoryRepository<E>
  implements SearchableRepositoryInterface<E, any, any>
{
  sortableFields: string[] = [];
  public async search(props: SearchParams): Promise<SearchResult<E>> {
    const itemsFiltered = await this.applyFilter(this.entities, props.filter);
    const itemsSorted = await this.applySort(
      itemsFiltered,
      props.sort,
      props.sort_dir
    );
    const itemsPaginated = await this.applyPagination(
      itemsSorted,
      props.page,
      props.per_page
    );

    return new SearchResult({
      items: itemsPaginated,
      total: itemsFiltered.length,
      current_page: props.page,
      per_page: props.per_page,
      sort: props.sort,
      sort_dir: props.sort_dir,
      filter: props.filter,
    });
  }

  protected abstract applyFilter(
    items: E[],
    filter: string | null
  ): Promise<E[]>;

  protected async applySort(
    items: E[],
    sort: string | null,
    sort_dir: SortDirection | null
  ): Promise<E[]> {
    if (!sort || !this.sortableFields.includes(sort)) {
      return items;
    }
    return [...items].sort((a, b) => {
      if (a.props[sort] < b.props[sort]) {
        return sort_dir === "ASC" ? -1 : 1;
      }

      if (a.props[sort] > b.props[sort]) {
        return sort_dir === "ASC" ? 1 : -1;
      }

      return 0;
    });
  }

  protected async applyPagination(
    items: E[],
    page: SearchParams["page"],
    per_page: SearchParams["per_page"]
  ): Promise<E[]> {
    const start = (page - 1) * per_page;
    const end = start + per_page;
    return items.slice(start, end);
  }
}

// soft delete - mixin
