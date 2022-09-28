import { Category, CategoryRepository } from "../../../domain";
import { CategoryInMemoryRepository } from "../../../infra";
import { ListCategoriesUseCase } from "../list-categories.use-case";

describe("CreateCategoryUseCase Unit Tests", () => {
  let useCase: ListCategoriesUseCase.UseCase;
  let categoryRepository: CategoryInMemoryRepository;

  beforeEach(() => {
    categoryRepository = new CategoryInMemoryRepository();
    useCase = new ListCategoriesUseCase.UseCase(categoryRepository);
  });

  test("toOutput method", () => {
    let result = new CategoryRepository.SearchResult({
      items: [],
      total: 1,
      current_page: 1,
      per_page: 2,
      sort: null,
      sort_dir: null,
      filter: null,
    });
    let output = useCase["toOutput"](result);
    expect(output).toStrictEqual({
      items: [],
      total: 1,
      current_page: 1,
      per_page: 2,
      last_page: 1,
    });
    const category = new Category({ name: "Movie" });
    result = new CategoryRepository.SearchResult({
      items: [category],
      total: 1,
      current_page: 1,
      per_page: 2,
      sort: null,
      sort_dir: null,
      filter: null,
    });
    output = useCase["toOutput"](result);
    expect(output).toStrictEqual({
      items: [category.toJSON()],
      total: 1,
      current_page: 1,
      per_page: 2,
      last_page: 1,
    });
  });

  it("should return output ordered by created_at when using empty input", async () => {
    const firstCreated = new Category({ name: "B" });
    firstCreated["created_at"] = new Date(2020, 1, 1);
    const secondCreated = new Category({ name: "A" });
    secondCreated["created_at"] = new Date(2020, 1, 2);
    const thirdCreated = new Category({ name: "C" });
    categoryRepository["entities"] = [
      secondCreated,
      thirdCreated,
      firstCreated,
    ];
    const result = await useCase.execute({});
    expect(result).toStrictEqual({
      items: [
        firstCreated.toJSON(),
        secondCreated.toJSON(),
        thirdCreated.toJSON(),
      ],
      total: 3,
      current_page: 1,
      per_page: 15,
      last_page: 1,
    });
  });

  it("should returns output using pagination, sort and filter", async () => {
    categoryRepository["entities"] = [
      new Category({ name: "a" }),
      new Category({ name: "AaA" }),
      new Category({ name: "AAA" }),
      new Category({ name: "b" }),
      new Category({ name: "c" }),
    ];
    let result = await useCase.execute({
      page: 1,
      per_page: 2,
      sort: "name",
      filter: "a",
    });
    expect(result).toStrictEqual({
      items: [
        categoryRepository["entities"][2].toJSON(),
        categoryRepository["entities"][1].toJSON(),
      ],
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
    expect(result).toStrictEqual({
      items: [categoryRepository["entities"][0].toJSON()],
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
    expect(result).toStrictEqual({
      items: [
        categoryRepository["entities"][0].toJSON(),
        categoryRepository["entities"][1].toJSON(),
      ],
      total: 3,
      current_page: 1,
      per_page: 2,
      last_page: 2,
    });
  });
});
