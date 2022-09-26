import UniqueEntityId from "../../../../@seedwork/domain/value-objects/unique-entity-id.vo";
import Category from "../category";

// Dublê de testes
// SpyOn - Espionar uma variável, classe ou método
// Mock - Simular uma variável, classe ou método
// stub - Substituir uma variável, classe ou método

describe("Category Unit Tests", () => {
  beforeEach(() => {
    Category.validate = jest.fn();
  });

  test("Should be able to create a new category", () => {
    const date = new Date();
    let category = new Category({
      name: "Movie",
      description: "Movie category",
      is_active: false,
      created_at: date,
    });
    expect(Category.validate).toBeCalledTimes(1);
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
    expect(Category.validate).toBeCalledTimes(2);
    expect(category).toBeInstanceOf(Category);
    expect(category.uniqueEntityId).toBe(uuid);
    expect(category.name).toBe("Movie");
    expect(category.description).toBeNull();
    expect(category.is_active).toBeTruthy();
    expect(category.created_at).toBeInstanceOf(Date);

    category = new Category({
      name: "Movie",
      description: "Movie category",
    });
    expect(Category.validate).toBeCalledTimes(3);
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
    expect(Category.validate).toBeCalledTimes(4);
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
    expect(Category.validate).toBeCalledTimes(5);
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

  test("Should be able to deactivate and activate category", () => {
    const category = new Category({
      name: "Movie",
    });
    expect(category.is_active).toBeTruthy();
    category.deactivate();
    expect(category.is_active).toBeFalsy();
    category.activate();
    expect(category.is_active).toBeTruthy();
  });

  test("Should be able to update category", () => {
    const category = new Category({
      name: "Movie",
    });
    expect(Category.validate).toBeCalledTimes(1);
    expect(category.name).toBe("Movie");
    expect(category.description).toBeNull();

    category.update(
      "Movie 2",
      "Movie category 2",
    );
    expect(Category.validate).toBeCalledTimes(2);
    expect(category.name).toBe("Movie 2");
    expect(category.description).toBe("Movie category 2");
  });
});
