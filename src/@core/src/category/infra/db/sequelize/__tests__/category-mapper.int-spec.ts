import { Category } from "#category/domain";
import { LoadEntityError, UniqueEntityId } from "#seedwork/domain";
import { setupSequelize } from "#seedwork/infra";
import { CategorySequelize } from "../category-sequelize";

describe("CategoryModelMapper Integration Tests", () => {
  setupSequelize({ models: [CategorySequelize.CategoryModel] });

  it("should throws an error when category is invalid", () => {
    const model = CategorySequelize.CategoryModel.build({
      id: "8e8db459-a941-48c5-8aa7-6dd8823cef81",
    });
    try {
      CategorySequelize.CategoryModelMapper.toEntity(model);
      fail("The category is valid, but it needs to throws a LoadEntityError");
    } catch (error) {
      expect(error).toBeInstanceOf(LoadEntityError);
      expect(error.message).toBe("Entity could not be loaded");
      expect(error.errors).toMatchObject({
        name: [
          "name should not be empty",
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      });
    }
  });

  it("should throws an generic error", () => {
    const error = new Error("Generic Error");
    const spyValidate = jest
      .spyOn(Category, "validate")
      .mockImplementation(() => {
        throw error;
      });
    const model = CategorySequelize.CategoryModel.build({
      id: "8e8db459-a941-48c5-8aa7-6dd8823cef81",
    });
    expect(() =>
      CategorySequelize.CategoryModelMapper.toEntity(model)
    ).toThrowError(error);
    expect(spyValidate).toHaveBeenCalled();
    spyValidate.mockRestore();
  });

  it("should convert a valid model to a category", () => {
    const model = CategorySequelize.CategoryModel.build({
      id: "8e8db459-a941-48c5-8aa7-6dd8823cef81",
      name: "Movie",
      description: "Movie description",
      is_active: true,
      created_at: new Date("2020-01-01"),
    });
    const entity = CategorySequelize.CategoryModelMapper.toEntity(model);
    expect(entity).toBeInstanceOf(Category);
    expect(model.toJSON()).toStrictEqual(
      new Category(
        {
          name: "Movie",
          description: "Movie description",
          is_active: true,
          created_at: new Date("2020-01-01"),
        },
        new UniqueEntityId("8e8db459-a941-48c5-8aa7-6dd8823cef81")
      ).toJSON()
    );
  });
});
