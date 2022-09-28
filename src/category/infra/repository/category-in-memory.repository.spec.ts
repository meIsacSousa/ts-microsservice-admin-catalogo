import { SearchParams } from "@seedwork/domain/repository/repository-contracts";
import Category from "../../domain/entities/category";
import CategoryInMemoryRepository from "./category-in-memory.repository";

describe("Category In Memory Repository Tests", () => {
  let repository = new CategoryInMemoryRepository();
  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
  });

  it("should order by created_at if sort is empty", async () => {
    const firstCreated = new Category({ name: "B" });
    firstCreated["created_at"] = new Date(2020, 1, 1);
    const secondCreated = new Category({ name: "A" });
    secondCreated["created_at"] = new Date(2020, 1, 2);
    const thirdCreated = new Category({ name: "C" });
    thirdCreated["created_at"] = new Date(2020, 1, 3);
    const result = await repository["applySort"](
      [secondCreated, thirdCreated, firstCreated],
      null,
      null
    );
    expect(result).toStrictEqual([firstCreated, secondCreated, thirdCreated]);
  });

  it("should order by created_at if sort is not a sortable field", async () => {
    const firstCreated = new Category({ name: "B" });
    firstCreated["created_at"] = new Date(2020, 1, 1);
    const secondCreated = new Category({ name: "A" });
    secondCreated["created_at"] = new Date(2020, 1, 2);
    const thirdCreated = new Category({ name: "C" });
    thirdCreated["created_at"] = new Date(2020, 1, 3);
    const result = await repository["applySort"](
      [secondCreated, thirdCreated, firstCreated],
      "not_sortable",
      null
    );
    expect(result).toStrictEqual([firstCreated, secondCreated, thirdCreated]);
  });

  it("should order by name in asc", async () => {
    const firstCreated = new Category({ name: "B" });
    const secondCreated = new Category({ name: "A" });
    const thirdCreated = new Category({ name: "C" });

    const result = await repository["applySort"](
      [thirdCreated, firstCreated, secondCreated],
      "name",
      "ASC"
    );
    expect(result).toStrictEqual([secondCreated, firstCreated, thirdCreated]);
  });

  it("should order by name in desc", async () => {
    const firstCreated = new Category({ name: "B" });
    const secondCreated = new Category({ name: "A" });
    const thirdCreated = new Category({ name: "C" });

    const result = await repository["applySort"](
      [secondCreated, firstCreated, thirdCreated],
      "name",
      "DESC"
    );
    expect(result).toStrictEqual([thirdCreated, firstCreated, secondCreated]);
  });

  it("should return all items if filter is null", async () => {
    const categories = [
      new Category({ name: "test" }),
      new Category({ name: "TeSt" }),
      new Category({ name: "TEST" }),
      new Category({ name: "a" }),
    ];
    const result = await repository["applyFilter"](categories, null);
    expect(result).toStrictEqual(categories);
  });

  it("should return items that match the filter", async () => {
    const categories = [
      new Category({ name: "test" }),
      new Category({ name: "TeSt" }),
      new Category({ name: "TEST" }),
      new Category({ name: "a" }),
    ];
    const result = await repository["applyFilter"](categories, "test");
    expect(result).toStrictEqual([categories[0], categories[1], categories[2]]);
  });
});
