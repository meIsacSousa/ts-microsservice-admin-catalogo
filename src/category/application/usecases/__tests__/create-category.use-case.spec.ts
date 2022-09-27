import CategoryInMemoryRepository from "../../../infra/repository/category-in-memory.repository";
import CreateCategoryUseCase from "../create-category.use-case";

describe("CreateCategoryUseCase Unit Tests", () => {
  let useCase: CreateCategoryUseCase;
  let categoryRepository: CategoryInMemoryRepository;

  beforeEach(() => {
    categoryRepository = new CategoryInMemoryRepository();
    useCase = new CreateCategoryUseCase(categoryRepository);
  });

  it("should create a category", async () => {
    const arrange = [
      {
        input: {
          name: "Category 1",
        },
        output: {
          position: 0,
          name: "Category 1",
          description: null,
          is_active: true,
          spyTimes: 1,
        },
      },
      {
        input: {
          name: "Category 1",
          description: "Description 1",
        },
        output: {
          position: 1,
          name: "Category 1",
          description: "Description 1",
          is_active: true,
          spyTimes: 2,
        },
      },
      {
        input: {
          name: "Category 1",
          description: "Description 1",
          is_active: false,
        },
        output: {
          position: 2,
          name: "Category 1",
          description: "Description 1",
          is_active: false,
          spyTimes: 3,
        },
      },
    ];
    const spyInsert = jest.spyOn(categoryRepository, "insert");
    for (const { input, output } of arrange) {
      const returnedOutput = await useCase.execute(input);
      expect(returnedOutput).toStrictEqual({
        id: categoryRepository["entities"][output.position].id,
        name: output.name,
        description: output.description,
        is_active: output.is_active,
        created_at: categoryRepository["entities"][output.position].created_at,
      });
      expect(spyInsert).toHaveBeenCalledTimes(output.spyTimes);
    }
  });
});
