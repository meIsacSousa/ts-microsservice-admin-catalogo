import { Category } from "#category/domain";
import { CategorySequelize } from "#category/infra";
import { ListCategoriesUseCase } from "../../list-categories.use-case";
import { setupSequelize } from "#seedwork/infra";
import _chance from "chance";
const { CategoryModel, CategorySequelizeRepository } = CategorySequelize;

describe("CreateCategoryUseCase Integration Tests", () => {
  let useCase: ListCategoriesUseCase.UseCase;
  let categoryRepository: CategorySequelize.CategorySequelizeRepository;

  setupSequelize({ models: [CategoryModel] });
  beforeEach(() => {
    categoryRepository = new CategorySequelizeRepository(CategoryModel);
    useCase = new ListCategoriesUseCase.UseCase(categoryRepository);
  });

  it("should return output ordered by created_at when using empty input", async () => {
    const categories = await CategoryModel.factory()
      .count(3)
      .bulkCreate((index) => {
        const chance = _chance();
        return {
          id: chance.guid({ version: 4 }),
          name: chance.name(),
          description: chance.sentence(),
          is_active: true,
          created_at: new Date(2020, 1, index + 1),
        };
      });
    const result = await useCase.execute({});
    expect(result).toMatchObject({
      items: [
        categories[2].toJSON(),
        categories[1].toJSON(),
        categories[0].toJSON(),
      ],
      total: 3,
      current_page: 1,
      per_page: 15,
      last_page: 1,
    });
  });

  it("should returns output using pagination, sort and filter", async () => {
    const categories = [
      new Category({ name: "a" }),
      new Category({ name: "AaA" }),
      new Category({ name: "AAA" }),
      new Category({ name: "b" }),
      new Category({ name: "c" }),
    ];
    await CategoryModel.bulkCreate(
      categories.map((category) => category.toJSON())
    );
    let result = await useCase.execute({
      page: 1,
      per_page: 2,
      sort: "name",
      filter: "a",
    });
    expect(result).toMatchObject({
      items: [categories[2], categories[1]].map((category) =>
        category.toJSON()
      ),
      total: 3,
      current_page: 1,
      per_page: 2,
      last_page: 2,
    });
    result = await useCase.execute({
      page: 2,
      per_page: 2,
      sort: "name",
      filter: "a",
    });
    expect(result).toMatchObject({
      items: [categories[0]].map((category) => category.toJSON()),
      total: 3,
      current_page: 2,
      per_page: 2,
      last_page: 2,
    });
    result = await useCase.execute({
      page: 1,
      per_page: 2,
      sort: "name",
      sort_dir: "DESC",
      filter: "a",
    });
    expect(result).toMatchObject({
      items: [categories[0], categories[1]].map((category) =>
        category.toJSON()
      ),
      total: 3,
      current_page: 1,
      per_page: 2,
      last_page: 2,
    });
  });
});
