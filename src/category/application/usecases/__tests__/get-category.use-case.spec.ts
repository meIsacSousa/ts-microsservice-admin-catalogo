import { Category } from "../../../domain";
import { CategoryInMemoryRepository } from "../../../infra";
import { GetCategoryUseCase } from "../get-category.use-case";

describe("GetCategoryUseCase Unit Tests", () => {
  let useCase: GetCategoryUseCase;
  let categoryRepository: CategoryInMemoryRepository;

  beforeEach(() => {
    categoryRepository = new CategoryInMemoryRepository();
    useCase = new GetCategoryUseCase(categoryRepository);
  });

  it("should throw an error if category not found", async () => {
    const input = {
      id: "123",
    };
    await expect(useCase.execute(input)).rejects.toThrowError(
      "Entity with id 123 not found"
    );
  });

  it("should get a category", async () => {
    const category = new Category({
      name: "Category 1",
      description: "Description 1",
    });
    categoryRepository["entities"][0] = category;
    const spyFindById = jest.spyOn(categoryRepository, "findById");
    await expect(useCase.execute({ id: category.id })).resolves.toStrictEqual({
      id: category.id,
      name: category.name,
      description: category.description,
      is_active: category.is_active,
      created_at: category.created_at,
    });
    expect(spyFindById).toHaveBeenCalledTimes(1);
  });
});
