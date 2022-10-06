import { CreateCategoryUseCase } from "../../create-category.use-case";
import { CategorySequelize } from "#category/infra";
import { setupSequelize } from "#seedwork/infra";
const { CategoryModel, CategorySequelizeRepository } = CategorySequelize;
describe("CreateCategoryUseCase Integration Tests", () => {
  let useCase: CreateCategoryUseCase.UseCase;
  let categoryRepository: CategorySequelize.CategorySequelizeRepository;

  setupSequelize({ models: [CategoryModel] });
  beforeEach(() => {
    categoryRepository = new CategorySequelizeRepository(CategoryModel);
    useCase = new CreateCategoryUseCase.UseCase(categoryRepository);
  });

  describe("should create a category", () => {
    const arrange = [
      {
        name: "Category 1",
      },
      {
        name: "Category 1",
        description: "Description 1",
      },
      {
        name: "Category 1",
        description: "Description 1",
        is_active: false,
      },
    ];
    test.each(arrange)("when given %j", async (input) => {
      const returnedOutput = await useCase.execute(input);
      const categoryFound = await CategoryModel.findByPk(returnedOutput.id);
      expect(returnedOutput).toStrictEqual(categoryFound.toJSON());
    });
  });
});
