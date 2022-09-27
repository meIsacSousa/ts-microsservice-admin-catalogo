import Category from "../../../domain/entities/category";
import { CategoryOutputMapper } from "./category-output";

describe("CategoryOutputMapper Unit Test", () => {
  it("should map a category to output", () => {
    const created_at = new Date();
    const category = new Category({
      name: "Category",
      description: "Some Description",
      is_active: true,
      created_at,
    });
    const spyToJson = jest.spyOn(category, "toJSON");
    const output = CategoryOutputMapper.toOutput(category);
    expect(spyToJson).toBeCalledTimes(1);
    expect(output).toStrictEqual({
      id: category.id,
      name: "Category",
      description: "Some Description",
      is_active: true,
      created_at,
    });
  });
});
