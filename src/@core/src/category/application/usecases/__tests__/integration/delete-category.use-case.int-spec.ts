import { setupSequelize } from "#seedwork/infra";
import { DeleteCategoryUseCase } from "../../delete-category.use-case";
import { CategorySequelize } from "#category/infra";
const { CategoryModel, CategorySequelizeRepository } = CategorySequelize;

describe("CreateCategoryUseCase Integration Tests", () => {
  let useCase: DeleteCategoryUseCase.UseCase;
  let categoryRepository: CategorySequelize.CategorySequelizeRepository;

  setupSequelize({ models: [CategoryModel] });
  beforeEach(() => {
    categoryRepository = new CategorySequelizeRepository(CategoryModel);
    useCase = new DeleteCategoryUseCase.UseCase(categoryRepository);
  });

  it("should throw an error if category not found", async () => {
    const input = {
      id: "fake_id",
    };
    await expect(useCase.execute(input)).rejects.toThrowError(
      "Entity Not Found using ID: fake_id"
    );
  });

  it("should delete category", async () => {
    const category = await CategoryModel.factory().create();
    let categoryFound = await CategoryModel.findByPk(category.id);
    expect(categoryFound).not.toBeNull();
    const input = {
      id: category.id,
    };
    await useCase.execute(input);
    categoryFound = await CategoryModel.findByPk(category.id);
    expect(categoryFound).toBeNull();
  });
});
