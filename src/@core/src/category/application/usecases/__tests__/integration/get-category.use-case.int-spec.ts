import { GetCategoryUseCase } from "../../get-category.use-case";
import { CategorySequelize } from "#category/infra";
import { setupSequelize } from "#seedwork/infra";
const { CategoryModel, CategorySequelizeRepository } = CategorySequelize;

describe("GetCategoryUseCase Integration Tests", () => {
  let useCase: GetCategoryUseCase.UseCase;
  let categoryRepository: CategorySequelize.CategorySequelizeRepository;

  setupSequelize({ models: [CategoryModel] });
  beforeEach(() => {
    categoryRepository = new CategorySequelizeRepository(CategoryModel);
    useCase = new GetCategoryUseCase.UseCase(categoryRepository);
  });

  it("should throw an error if category not found", async () => {
    const input = {
      id: "123",
    };
    await expect(useCase.execute(input)).rejects.toThrowError(
      "Entity Not Found using ID: 123"
    );
  });

  it("should get a category", async () => {
    const category = await CategoryModel.factory().create();
    await expect(useCase.execute({ id: category.id })).resolves.toStrictEqual({
      id: category.id,
      name: category.name,
      description: category.description,
      is_active: category.is_active,
      created_at: category.created_at,
    });
  });
});
