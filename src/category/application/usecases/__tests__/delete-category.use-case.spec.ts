import Category from "../../../domain/entities/category";
import CategoryInMemoryRepository from "../../../infra/repository/category-in-memory.repository";
import { DeleteCategoryUseCase } from "../delete-category.use-case";

describe("CreateCategoryUseCase Unit Tests", () => {
  let useCase: DeleteCategoryUseCase;
  let categoryRepository: CategoryInMemoryRepository;

  beforeEach(() => {
    categoryRepository = new CategoryInMemoryRepository();
    useCase = new DeleteCategoryUseCase(categoryRepository);
  });

  it("should throw an error if category not found", async () => {
    const input = {
      id: "fake_id",
    };
    await expect(useCase.execute(input)).rejects.toThrowError(
      "Entity with id fake_id not found"
    );
  });

  it("should delete category", async () => {
    const category = new Category({ name: "Category 1" });
    categoryRepository["entities"] = [category];
    const input = {
      id: category.id,
    };
    await useCase.execute(input);
    expect(categoryRepository["entities"]).toHaveLength(0);
  });
});
