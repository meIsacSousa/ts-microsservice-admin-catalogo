import Category from "./category";

describe("Category Tests", () => {
  test("Should be able to create a new category", () => {
    const category = new Category("Movie");

    expect(category).toBeInstanceOf(Category);
    expect(category.name).toBe("Movie");
  });
});
