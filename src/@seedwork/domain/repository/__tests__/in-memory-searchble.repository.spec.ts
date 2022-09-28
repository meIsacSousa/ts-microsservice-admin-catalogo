import { Entity } from "../../../domain";
import { InMemorySearchableRepository } from "../in-memory.repository";
import { SearchParams, SearchResult } from "../repository-contracts";

type StubEntityProps = {
  name: string;
  price: number;
};

class StubEntity extends Entity<StubEntityProps> {}

class StubInMemorySearchableRepository extends InMemorySearchableRepository<StubEntity> {
  sortableFields = ["name"];

  protected async applyFilter(
    items: StubEntity[],
    filter: string
  ): Promise<StubEntity[]> {
    if (!filter) {
      return items;
    }

    return items.filter((i) => {
      return (
        i.props.name.toLowerCase().includes(filter.toLowerCase()) ||
        i.props.price.toString() === filter
      );
    });
  }
}

describe("InMemorySearchableRepository Unit Tests", () => {
  let repository: StubInMemorySearchableRepository;
  beforeEach(() => {
    repository = new StubInMemorySearchableRepository();
  });

  describe("applyFilter method", () => {
    it("should return all items if filter is empty", async () => {
      const items = [
        new StubEntity({ name: "item 1", price: 10 }),
        new StubEntity({ name: "item 2", price: 20 }),
      ];
      const spyFilterMethod = jest.spyOn(items, "filter");
      const result = await repository["applyFilter"](items, null);
      expect(result).toStrictEqual(items);
      expect(spyFilterMethod).not.toHaveBeenCalled();
    });

    it("should return items that match filter", async () => {
      const items = [
        new StubEntity({ name: "item 1", price: 10 }),
        new StubEntity({ name: "item 2", price: 20 }),
      ];
      const spyFilterMethod = jest.spyOn(items, "filter");
      const result = await repository["applyFilter"](items, "item 1");
      expect(result).toStrictEqual([items[0]]);
      expect(spyFilterMethod).toHaveBeenCalledTimes(1);
    });

    it("should return items that match filter by price", async () => {
      const items = [
        new StubEntity({ name: "item 1", price: 10 }),
        new StubEntity({ name: "item 2", price: 20 }),
      ];
      const spyFilterMethod = jest.spyOn(items, "filter");
      const result = await repository["applyFilter"](items, "20");
      expect(result).toStrictEqual([items[1]]);
      expect(spyFilterMethod).toHaveBeenCalledTimes(1);
    });

    it("should filter by name and by prince in sequence", async () => {
      const items = [
        new StubEntity({ name: "item 1", price: 10 }),
        new StubEntity({ name: "item 2", price: 20 }),
        new StubEntity({ name: "item 1", price: 20 }),
      ];
      let result = await repository["applyFilter"](items, "item 1");
      expect(result).toStrictEqual([items[0], items[2]]);
      result = await repository["applyFilter"](result, "20");
      expect(result).toStrictEqual([items[2]]);
    });
  });

  describe("applySort method", () => {
    it("should return all items in the same order if sort is empty", async () => {
      const items = [
        new StubEntity({ name: "item 1", price: 10 }),
        new StubEntity({ name: "item 2", price: 20 }),
        new StubEntity({ name: "item 1", price: 20 }),
      ];
      const result = await repository["applySort"](items, null, null);
      expect(result).toStrictEqual(items);
    });

    it("should return all items in the same order if sort is not in sortableFields", async () => {
      const items = [
        new StubEntity({ name: "item 1", price: 10 }),
        new StubEntity({ name: "item 2", price: 20 }),
        new StubEntity({ name: "item 1", price: 10 }),
      ];
      const result = await repository["applySort"](items, "price", "ASC");
      expect(result).toStrictEqual(items);
    });

    it("should return items in asc order by name", async () => {
      const items = [
        new StubEntity({ name: "item 1", price: 10 }),
        new StubEntity({ name: "item 2", price: 20 }),
        new StubEntity({ name: "item 1", price: 20 }),
      ];
      const result = await repository["applySort"](items, "name", "ASC");
      expect(result).toStrictEqual([items[0], items[2], items[1]]);
    });

    it("should return items in desc order by name", async () => {
      const items = [
        new StubEntity({ name: "item 1", price: 10 }),
        new StubEntity({ name: "item 2", price: 20 }),
        new StubEntity({ name: "item 1", price: 20 }),
      ];
      const result = await repository["applySort"](items, "name", "DESC");
      expect(result).toStrictEqual([items[1], items[0], items[2]]);
    });
  });

  describe("applyPagination method", () => {
    it("should return items in the page", async () => {
      const items = [
        new StubEntity({ name: "item 1", price: 10 }),
        new StubEntity({ name: "item 2", price: 20 }),
        new StubEntity({ name: "item 3", price: 20 }),
        new StubEntity({ name: "item 4", price: 20 }),
        new StubEntity({ name: "item 5", price: 20 }),
        new StubEntity({ name: "item 6", price: 20 }),
        new StubEntity({ name: "item 7", price: 20 }),
      ];
      let result = await repository["applyPagination"](items, 1, 2);
      expect(result).toStrictEqual([items[0], items[1]]);
      result = await repository["applyPagination"](items, 4, 2);
      expect(result).toStrictEqual([items[6]]);
      result = await repository["applyPagination"](items, 1, 4);
      expect(result).toStrictEqual([items[0], items[1], items[2], items[3]]);
      result = await repository["applyPagination"](items, 5, 4);
      expect(result).toStrictEqual([]);
    });
  });

  describe("search method", () => {
    it("should apply paginate only when other params are null", async () => {
      const entity = new StubEntity({ name: "item 1", price: 10 });
      const asserts = Array(16).fill(entity);
      repository["entities"] = asserts;
      const result = await repository.search(new SearchParams());
      expect(result).toStrictEqual(
        new SearchResult({
          items: Array(15).fill(entity),
          total: 16,
          current_page: 1,
          per_page: 15,
          sort: null,
          sort_dir: null,
          filter: null,
        })
      );
    });

    it("should apply paginate and filter", async () => {
      const items = [
        new StubEntity({ name: "test", price: 10 }),
        new StubEntity({ name: "a", price: 20 }),
        new StubEntity({ name: "TEST", price: 40 }),
        new StubEntity({ name: "TeSt", price: 30 }),
      ];
      repository["entities"] = items;
      let result = await repository.search(
        new SearchParams({
          page: 1,
          per_page: 2,
          filter: "test",
        })
      );
      expect(result).toStrictEqual(
        new SearchResult({
          items: [items[0], items[2]],
          total: 3,
          current_page: 1,
          per_page: 2,
          sort: null,
          sort_dir: null,
          filter: "test",
        })
      );

      result = await repository.search(
        new SearchParams({ page: 2, per_page: 2, filter: "TEST" })
      );
      expect(result).toStrictEqual(
        new SearchResult({
          items: [items[3]],
          total: 3,
          current_page: 2,
          per_page: 2,
          sort: null,
          sort_dir: null,
          filter: "TEST",
        })
      );
    });

    it("should apply paginate and sort", async () => {
      const items = [
        new StubEntity({ name: "b", price: 20 }),
        new StubEntity({ name: "a", price: 10 }),
        new StubEntity({ name: "d", price: 30 }),
        new StubEntity({ name: "e", price: 40 }),
        new StubEntity({ name: "c", price: 40 }),
      ];
      repository["entities"] = items;
      const arrange = [
        {
          params: new SearchParams({
            page: 1,
            per_page: 2,
            sort: "name",
          }),
          result: new SearchResult({
            items: [items[1], items[0]],
            total: 5,
            current_page: 1,
            per_page: 2,
            sort: "name",
            sort_dir: "ASC",
            filter: null,
          }),
        },
        {
          params: new SearchParams({
            page: 2,
            per_page: 2,
            sort: "name",
          }),
          result: new SearchResult({
            items: [items[4], items[2]],
            total: 5,
            current_page: 2,
            per_page: 2,
            sort: "name",
            sort_dir: "ASC",
            filter: null,
          }),
        },
        {
          params: new SearchParams({
            page: 1,
            per_page: 2,
            sort: "name",
            sort_dir: "DESC",
          }),
          result: new SearchResult({
            items: [items[3], items[2]],
            total: 5,
            current_page: 1,
            per_page: 2,
            sort: "name",
            sort_dir: "DESC",
            filter: null,
          }),
        },
      ];

      for (const item of arrange) {
        let result = await repository.search(new SearchParams(item.params));
        expect(result).toStrictEqual(item.result);
      }
    });

    it("should apply paginate, filter and sort", async () => {
      const items = [
        new StubEntity({ name: "test", price: 20 }),
        new StubEntity({ name: "a", price: 10 }),
        new StubEntity({ name: "TEST", price: 30 }),
        new StubEntity({ name: "e", price: 40 }),
        new StubEntity({ name: "TeSt", price: 40 }),
      ];
      repository["entities"] = items;
      const arrange = [
        {
          params: new SearchParams({
            page: 1,
            per_page: 2,
            sort: "name",
            filter: "TEST",
          }),
          result: new SearchResult({
            items: [items[2], items[4]],
            total: 3,
            current_page: 1,
            per_page: 2,
            sort: "name",
            sort_dir: "ASC",
            filter: "TEST",
          }),
        },
        {
          params: new SearchParams({
            page: 2,
            per_page: 2,
            sort: "name",
            filter: "TEST",
          }),
          result: new SearchResult({
            items: [items[0]],
            total: 3,
            current_page: 2,
            per_page: 2,
            sort: "name",
            sort_dir: "ASC",
            filter: "TEST",
          }),
        },
      ];

      for (const item of arrange) {
        let result = await repository.search(new SearchParams(item.params));
        expect(result).toStrictEqual(item.result);
      }
    });
  });
});
