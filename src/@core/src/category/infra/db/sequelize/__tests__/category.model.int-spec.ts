import { setupSequelize } from "#seedwork/infra";
import { DataType } from "sequelize-typescript";
import { CategorySequelize } from "../category-sequelize";

describe("CategoryModel Integration Tests", () => {
  setupSequelize({ models: [CategorySequelize.CategoryModel] });
  test("mapping props", () => {
    const attributesMap = CategorySequelize.CategoryModel.getAttributes();
    const attributes = Object.keys(attributesMap);
    expect(attributes).toStrictEqual([
      "id",
      "name",
      "description",
      "is_active",
      "created_at",
    ]);
    const arrange = [
      {
        attr: attributesMap.id,
        match: {
          field: "id",
          fieldName: "id",
          primaryKey: true,
          type: DataType.UUID(),
        },
      },
      {
        attr: attributesMap.name,
        match: {
          field: "name",
          fieldName: "name",
          allowNull: false,
          type: DataType.STRING(255),
        },
      },
      {
        attr: attributesMap.description,
        match: {
          field: "description",
          fieldName: "description",
          allowNull: true,
          type: DataType.TEXT(),
        },
      },
      {
        attr: attributesMap.is_active,
        match: {
          field: "is_active",
          fieldName: "is_active",
          allowNull: false,
          type: DataType.BOOLEAN(),
        },
      },
      {
        attr: attributesMap.created_at,
        match: {
          field: "created_at",
          fieldName: "created_at",
          allowNull: false,
          type: DataType.DATE(),
        },
      },
    ];
    for (const item of arrange) {
      expect(item.attr).toMatchObject(item.match);
    }
  });

  test("create", async () => {
    const arrange = [
      {
        id: "5646f4f0-8f4d-4b1f-9a82-2c8597c42d9d",
        name: "name",
        is_active: true,
        created_at: new Date(),
      },
      {
        id: "5646f4f0-8f4d-4b1f-9a82-2c8597c42d9e",
        name: "name",
        description: "description",
        is_active: true,
        created_at: new Date(),
      },
    ];
    for (const i of arrange) {
      const category = await CategorySequelize.CategoryModel.create(i);
      expect(category.toJSON()).toStrictEqual(i);
    }
  });
});
