import UniqueEntityId from "../../../@seedwork/domain/unique-entity-id.vo";
import Category from "./category";

describe("Category Unit Tests", () => {
  test("Should be able to create a new category", () => {
    const date = new Date();
    let category = new Category({
      name: "Movie",
      description: "Movie category",
      is_active: false,
      created_at: date,
    });
    expect(category).toBeInstanceOf(Category);
    expect(category.id).toBeDefined();
    expect(category.id).not.toBeNull();
    expect(category.name).toBe("Movie");
    expect(category.description).toBe("Movie category");
    expect(category.is_active).toBeFalsy();
    expect(category.created_at).toBe(date);

    const uuid = new UniqueEntityId();
    category = new Category(
      {
        name: "Movie",
      },
      uuid
    );
    expect(category).toBeInstanceOf(Category);
    expect(category.id).toBe(uuid);
    expect(category.name).toBe("Movie");
    expect(category.description).toBeNull();
    expect(category.is_active).toBeTruthy();
    expect(category.created_at).toBeInstanceOf(Date);

    category = new Category({
      name: "Movie",
      description: "Movie category",
    });
    expect(category).toBeInstanceOf(Category);
    expect(category.id).not.toBeNull();
    expect(category.name).toBe("Movie");
    expect(category.description).toBe("Movie category");
    expect(category.is_active).toBeTruthy();
    expect(category.created_at).toBeInstanceOf(Date);

    category = new Category({
      name: "Movie",
      is_active: false,
    });
    expect(category).toBeInstanceOf(Category);
    expect(category.id).toBeDefined();
    expect(category.name).toBe("Movie");
    expect(category.description).toBeNull();
    expect(category.is_active).toBeFalsy();
    expect(category.created_at).toBeInstanceOf(Date);

    category = new Category({
      name: "Movie",
      created_at: date,
    });
    expect(category).toBeInstanceOf(Category);
    expect(category.name).toBe("Movie");
    expect(category.description).toBeNull();
    expect(category.is_active).toBeTruthy();
    expect(category.created_at).toBe(date);
  });

  test("Should description getter and setter work", () => {
    const category = new Category({
      name: "Movie",
    });
    expect(category.description).toBeNull();
    category["description"] = "Movie category 2";
    expect(category.description).toBe("Movie category 2");
  });

  test("Should created_at setter work", () => {
    const date = new Date();
    const category = new Category({
      name: "Movie",
    });
    expect(category.created_at).toBeInstanceOf(Date);
    category["created_at"] = date;
    expect(category.created_at).toBe(date);
  });
  test("Should is_active setter work", () => {
    const category = new Category({
      name: "Movie",
    });
    expect(category.is_active).toBeTruthy();
    category["is_active"] = false;
    expect(category.is_active).toBeFalsy();
  });
});
