import { Category, CategoryRepository } from "#category/domain";
import { UniqueEntityId } from "#seedwork/domain";
import { setupSequelize } from "#seedwork/infra";
import _chance from "chance";
import { CategorySequelize } from "../category-sequelize";

describe("CategorySequelizeRepository Integration Tests", () => {
  setupSequelize({ models: [CategorySequelize.CategoryModel] });
  let repository: CategorySequelize.CategorySequelizeRepository;
  let chance: Chance.Chance;

  beforeAll(() => {
    chance = _chance();
  });

  beforeEach(async () => {
    repository = new CategorySequelize.CategorySequelizeRepository(
      CategorySequelize.CategoryModel
    );
  });

  describe("should insert a new category", () => {
    const arrange = [
      new Category({ name: "Movie" }),
      new Category({ name: "Music", description: "Music description" }),
      new Category({
        name: "Book",
        description: "Book description",
        is_active: false,
      }),
      new Category({
        name: "Game",
        description: "Game description",
        is_active: true,
        created_at: new Date("2020-01-01"),
      }),
    ];
    test.each(arrange)("should insert a new category: %j", async (category) => {
      await repository.insert(category);
      const found = await CategorySequelize.CategoryModel.findByPk(category.id);
      expect(found.toJSON()).toStrictEqual(category.toJSON());
    });
  });

  describe("should thrown an error if trying to get a non-existent category", () => {
    const arrange = [
      new UniqueEntityId(),
      "8e8db459-a941-48c5-8aa7-6dd8823cef81",
    ];
    test.each(arrange)("id: %s", async (id) => {
      await expect(repository.findById(id)).rejects.toThrowError(
        `Entity Not Found using ID: ${id}`
      );
    });
  });

  it("should get a category by id", async () => {
    const arrange = [
      new Category({ name: "Movie" }),
      new Category({ name: "Music", description: "Music description" }),
      new Category({
        name: "Book",
        description: "Book description",
        is_active: false,
      }),
      new Category({
        name: "Game",
        description: "Game description",
        is_active: true,
        created_at: new Date("2020-01-01"),
      }),
    ];
    for (const category of arrange) {
      await CategorySequelize.CategoryModel.create(category.toJSON());
      const found = await repository.findById(category.id);
      expect(found.toJSON()).toStrictEqual(category.toJSON());
    }
  });

  it("should return all categories", async () => {
    const arrange = [
      new Category({ name: "Movie" }),
      new Category({ name: "Music", description: "Music description" }),
      new Category({
        name: "Book",
        description: "Book description",
        is_active: false,
      }),
      new Category({
        name: "Game",
        description: "Game description",
        is_active: true,
        created_at: new Date("2020-01-01"),
      }),
    ];
    for (const category of arrange) {
      await CategorySequelize.CategoryModel.create(category.toJSON());
    }
    const found = await repository.findAll();
    expect(found.length).toBe(arrange.length);
    expect(JSON.stringify(found)).toBe(JSON.stringify(arrange));
  });

  it("should throws an error on update when entity not found", async () => {
    const category = new Category({ name: "Movie" });
    await expect(repository.update(category)).rejects.toThrowError(
      `Entity Not Found using ID: ${category.id}`
    );
  });

  it("should update a category", async () => {
    const arrange = new Category({ name: "Movie" });
    await CategorySequelize.CategoryModel.create(arrange.toJSON());
    arrange.update("Music", "Music description");
    await repository.update(arrange);
    const found = await CategorySequelize.CategoryModel.findByPk(arrange.id);
    expect(arrange.toJSON()).toStrictEqual(found.toJSON());
  });

  it("should throwns an error on delete when entity not found", async () => {
    const category = new Category({ name: "Movie" });
    await expect(repository.delete(category.id)).rejects.toThrowError(
      `Entity Not Found using ID: ${category.id}`
    );
    await expect(
      repository.delete(category.uniqueEntityId)
    ).rejects.toThrowError(`Entity Not Found using ID: ${category.id}`);
  });

  it("should delete a category", async () => {
    const arrange = new Category({ name: "Movie" });
    await CategorySequelize.CategoryModel.create(arrange.toJSON());
    await repository.delete(arrange.id);
    let found = await CategorySequelize.CategoryModel.findByPk(arrange.id);
    expect(found).toBeNull();

    await CategorySequelize.CategoryModel.create(arrange.toJSON());
    await repository.delete(arrange.uniqueEntityId);
    found = await CategorySequelize.CategoryModel.findByPk(arrange.id);
    expect(found).toBeNull();
  });

  describe("search method tests", () => {
    it("should apply only paginate when the params are null", async () => {
      const created_at = new Date();
      await CategorySequelize.CategoryModel.factory()
        .count(16)
        .bulkCreate((index) => ({
          id: chance.guid({ version: 4 }),
          name: `Category ${index}`,
          description: `Category ${index} description`,
          is_active: true,
          created_at,
        }));
      const spyToEntity = jest.spyOn(
        CategorySequelize.CategoryModelMapper,
        "toEntity"
      );
      const searchOutput = await repository.search(
        new CategoryRepository.SearchParams()
      );
      expect(spyToEntity).toHaveBeenCalledTimes(15);
      expect(searchOutput).toBeInstanceOf(CategoryRepository.SearchResult);
      expect(searchOutput.toJSON(true)).toMatchObject({
        total: 16,
        current_page: 1,
        per_page: 15,
        sort: null,
        sort_dir: null,
        filter: null,
      });
      searchOutput.items.forEach((item, index) => {
        expect(item).toBeInstanceOf(Category);
        expect(item.toJSON()).toMatchObject({
          name: `Category ${index}`,
          description: `Category ${index} description`,
          is_active: true,
          created_at,
        });
      });
    });

    it("should order by created_at DESC when search params are null", async () => {
      await CategorySequelize.CategoryModel.factory()
        .count(16)
        .bulkCreate((index) => ({
          id: chance.guid({ version: 4 }),
          name: `Category ${index}`,
          description: `Category ${index} description`,
          is_active: true,
          created_at: new Date(`2020-01-${index + 1}`),
        }));
      const searchOutput = await repository.search(
        new CategoryRepository.SearchParams()
      );
      searchOutput.items.forEach((item, index) => {
        expect(item).toBeInstanceOf(Category);
        expect(item.toJSON()).toMatchObject({
          name: `Category ${15 - index}`,
        });
      });
    });

    it("should paginate and filter by name", async () => {
      const categories = await CategorySequelize.CategoryModel.factory()
        .count(14)
        .bulkCreate((index) => ({
          id: chance.guid({ version: 4 }),
          name: `Category ${index}`,
          description: `Category ${index} description`,
          is_active: true,
          created_at: new Date(`2020-01-${index + 1}`),
        }));
      let searchOutput = await repository.search(
        new CategoryRepository.SearchParams({
          page: 1,
          per_page: 3,
          filter: "Category 1",
        })
      );
      expect(searchOutput.toJSON(true)).toMatchObject(
        new CategoryRepository.SearchResult({
          items: [
            CategorySequelize.CategoryModelMapper.toEntity(categories[13]),
            CategorySequelize.CategoryModelMapper.toEntity(categories[12]),
            CategorySequelize.CategoryModelMapper.toEntity(categories[11]),
          ],
          total: 5,
          current_page: 1,
          per_page: 3,
          sort: null,
          sort_dir: null,
          filter: "Category 1",
        }).toJSON(true)
      );
      searchOutput = await repository.search(
        new CategoryRepository.SearchParams({
          page: 2,
          per_page: 3,
          filter: "Category 1",
        })
      );
      expect(searchOutput.toJSON(true)).toMatchObject(
        new CategoryRepository.SearchResult({
          items: [
            CategorySequelize.CategoryModelMapper.toEntity(categories[10]),
            CategorySequelize.CategoryModelMapper.toEntity(categories[1]),
          ],
          total: 5,
          current_page: 2,
          per_page: 3,
          sort: null,
          sort_dir: null,
          filter: "Category 1",
        }).toJSON(true)
      );
    });

    it("should paginate and order by name", async () => {
      expect(repository.sortableFields).toStrictEqual(["name"]);
      const categories = await CategorySequelize.CategoryModel.factory()
        .count(3)
        .bulkCreate((index) => ({
          id: chance.guid({ version: 4 }),
          name: `Category ${index}`,
          description: `Category ${index} description`,
          is_active: true,
          created_at: new Date(`2020-01-${index + 1}`),
        }));
      let searchOutput = await repository.search(
        new CategoryRepository.SearchParams({
          page: 1,
          per_page: 3,
          sort: "name",
          sort_dir: "ASC",
        })
      );
      expect(searchOutput.toJSON(true)).toMatchObject(
        new CategoryRepository.SearchResult({
          items: [
            CategorySequelize.CategoryModelMapper.toEntity(categories[0]),
            CategorySequelize.CategoryModelMapper.toEntity(categories[1]),
            CategorySequelize.CategoryModelMapper.toEntity(categories[2]),
          ],
          total: 3,
          current_page: 1,
          per_page: 3,
          sort: "name",
          sort_dir: "ASC",
          filter: null,
        }).toJSON(true)
      );
      searchOutput = await repository.search(
        new CategoryRepository.SearchParams({
          page: 1,
          per_page: 3,
          sort: "name",
          sort_dir: "DESC",
        })
      );
      expect(searchOutput.toJSON(true)).toMatchObject(
        new CategoryRepository.SearchResult({
          items: [
            CategorySequelize.CategoryModelMapper.toEntity(categories[2]),
            CategorySequelize.CategoryModelMapper.toEntity(categories[1]),
            CategorySequelize.CategoryModelMapper.toEntity(categories[0]),
          ],
          total: 3,
          current_page: 1,
          per_page: 3,
          sort: "name",
          sort_dir: "DESC",
          filter: null,
        }).toJSON(true)
      );
    });

    it("should order by created_at if sort is not a sortable field", async () => {
      const categories = await CategorySequelize.CategoryModel.factory()
        .count(3)
        .bulkCreate((index) => ({
          id: chance.guid({ version: 4 }),
          name: `Category ${index}`,
          description: `Category ${index} description`,
          is_active: true,
          created_at: new Date(`2020-01-${index + 1}`),
        }));
      let searchOutput = await repository.search(
        new CategoryRepository.SearchParams({
          page: 1,
          per_page: 3,
          sort: "description",
          sort_dir: "ASC",
        })
      );
      expect(searchOutput.toJSON(true)).toMatchObject(
        new CategoryRepository.SearchResult({
          items: [
            CategorySequelize.CategoryModelMapper.toEntity(categories[2]),
            CategorySequelize.CategoryModelMapper.toEntity(categories[1]),
            CategorySequelize.CategoryModelMapper.toEntity(categories[0]),
          ],
          total: 3,
          current_page: 1,
          per_page: 3,
          sort: "description",
          sort_dir: "ASC",
          filter: null,
        }).toJSON(true)
      );
    });

    it("should apply paginate, sort and filter", async () => {
      const categories = await CategorySequelize.CategoryModel.factory()
        .count(12)
        .bulkCreate((index) => ({
          id: chance.guid({ version: 4 }),
          name: `Category ${index}`,
          description: `Category ${index} description`,
          is_active: true,
          created_at: new Date(`2020-01-${index + 1}`),
        }));
      let searchOutput = await repository.search(
        new CategoryRepository.SearchParams({
          page: 1,
          per_page: 2,
          sort: "name",
          sort_dir: "ASC",
          filter: "Category 1",
        })
      );
      expect(searchOutput.toJSON(true)).toMatchObject(
        new CategoryRepository.SearchResult({
          items: [
            CategorySequelize.CategoryModelMapper.toEntity(categories[1]),
            CategorySequelize.CategoryModelMapper.toEntity(categories[10]),
          ],
          total: 3,
          current_page: 1,
          per_page: 2,
          sort: "name",
          sort_dir: "ASC",
          filter: "Category 1",
        }).toJSON(true)
      );
      searchOutput = await repository.search(
        new CategoryRepository.SearchParams({
          page: 2,
          per_page: 2,
          sort: "name",
          sort_dir: "ASC",
          filter: "Category 1",
        })
      );
      expect(searchOutput.toJSON(true)).toMatchObject(
        new CategoryRepository.SearchResult({
          items: [
            CategorySequelize.CategoryModelMapper.toEntity(categories[11]),
          ],
          total: 3,
          current_page: 2,
          per_page: 2,
          sort: "name",
          sort_dir: "ASC",
          filter: "Category 1",
        }).toJSON(true)
      );
    });
  });
});
