import UniqueEntityId from "../value-objects/unique-entity-id.vo";
import Entity from "../entity/entity";

export interface RepositoryInterface<E extends Entity> {
  findAll(): Promise<E[]>;
  findById(id: string | UniqueEntityId): Promise<E>;
  insert(entity: E): Promise<void>;
  update(entity: E): Promise<void>;
  delete(id: string | UniqueEntityId): Promise<void>;
}

export type SortDirection = "ASC" | "DESC";

export type SearchProps<Filter = string> = {
  page?: number;
  per_page?: number;
  sort?: string | null;
  sort_dir?: SortDirection | null;
  filter?: Filter | null;
};

export class SearchParams<Filter = string> {
  protected _page: number;
  protected _per_page: number = 15;
  protected _sort: string | null;
  protected _sort_dir: SortDirection | null;
  protected _filter: Filter | null;

  constructor(props: SearchProps<Filter> = {}) {
    this.page = props.page;
    this.per_page = props.per_page;
    this.sort = props.sort;
    this.sort_dir = props.sort_dir;
    this.filter = props.filter;
  }

  get page() {
    return this._page;
  }

  private set page(page: number) {
    let _page = +page;
    if (Number.isNaN(_page) || _page < 1 || parseInt(_page as any) !== _page) {
      _page = 1;
    }
    this._page = _page;
  }

  get per_page() {
    return this._per_page;
  }

  private set per_page(per_page: number) {
    let _per_page = per_page === (true as any) ? this._per_page : +per_page;
    if (
      Number.isNaN(_per_page) ||
      _per_page < 1 ||
      parseInt(_per_page as any) !== _per_page
    ) {
      _per_page = this._per_page;
    }
    this._per_page = _per_page;
  }

  get sort(): string | null {
    return this._sort;
  }

  private set sort(sort: string | null) {
    this._sort =
      sort === null || sort === undefined || sort === "" ? null : `${sort}`;
  }

  get sort_dir(): SortDirection | null {
    return this._sort_dir;
  }

  private set sort_dir(sort_dir: SortDirection | null) {
    if (!this.sort) {
      this._sort_dir = null;
      return;
    }

    const _sort_dir = `${sort_dir}`.toUpperCase();
    this._sort_dir =
      _sort_dir === "ASC" || _sort_dir === "DESC" ? _sort_dir : "ASC";
  }

  get filter(): Filter | null {
    return this._filter;
  }

  private set filter(filter: Filter | null) {
    this._filter =
      filter === null || filter === undefined || filter === ""
        ? null
        : (`${filter}` as any);
  }
}

export type SearchResultProps<E extends Entity, Filter> = {
  items: E[];
  total: number;
  current_page: number;
  per_page: number;
  last_page?: number;
  sort?: string | null;
  sort_dir: string | null;
  filter: Filter | null;
};

export class SearchResult<E extends Entity, Filter = string> {
  readonly items: E[];
  readonly total: number;
  readonly current_page: number;
  readonly per_page: number;
  readonly last_page: number;
  readonly sort?: string | null;
  readonly sort_dir: string | null;
  readonly filter: Filter;

  constructor(props: SearchResultProps<E, Filter>) {
    this.items = props.items;
    this.total = props.total;
    this.current_page = props.current_page;
    this.per_page = props.per_page;
    this.last_page = Math.ceil(props.total / props.per_page);
    this.sort = props.sort;
    this.sort_dir = props.sort_dir;
    this.filter = props.filter;
  }

  toJSON() {
    return {
      items: this.items,
      total: this.total,
      current_page: this.current_page,
      per_page: this.per_page,
      last_page: this.last_page,
      sort: this.sort,
      sort_dir: this.sort_dir,
      filter: this.filter,
    };
  }
}

export interface SearchableRepositoryInterface<
  E extends Entity,
  Filter = string,
  SearchInput = SearchParams,
  SearchOutput = SearchResult<E, Filter>
> extends RepositoryInterface<E> {
  sortableFields: string[];
  search(props: SearchInput): Promise<SearchOutput>;
}
