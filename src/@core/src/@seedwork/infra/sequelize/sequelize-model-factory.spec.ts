import {
  Column,
  PrimaryKey,
  DataType,
  Model,
  Table,
} from "sequelize-typescript";
import { SequelizeModelFactory } from "./sequelize-model-factory";
import _chance from "chance";
import { validate as UUIDValidate } from "uuid";
import { setupSequelize } from "../testing";

const chance = _chance();
@Table({ timestamps: false })
class StubModel extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID })
  declare id: string;

  @Column({ allowNull: false, type: DataType.STRING(255) })
  declare name: string;

  static mockFactory = jest.fn(() => ({
    id: chance.guid({ version: 4 }),
    name: chance.word(),
  }));

  static factory() {
    return new SequelizeModelFactory<StubModel, { id: string; name: string }>(
      StubModel,
      StubModel.mockFactory
    );
  }
}

describe("SequelizeModelFactory Unit Tests", () => {
  setupSequelize({ models: [StubModel] });

  test("create method", async () => {
    let model = await StubModel.factory().create();
    expect(model).toBeInstanceOf(StubModel);
    expect(UUIDValidate(model.id)).toBeTruthy();
    expect(model.name).not.toBeNull();
    expect(StubModel.mockFactory).toBeCalledTimes(1);
    let modelFound = await StubModel.findByPk(model.id);
    expect(model.id).toBe(modelFound.id);
    model = await StubModel.factory().create({
      id: "5457f479-d9aa-4912-9a47-2e886e343f33",
      name: "test",
    });
    expect(model.toJSON()).toStrictEqual({
      id: "5457f479-d9aa-4912-9a47-2e886e343f33",
      name: "test",
    });
    expect(StubModel.mockFactory).toBeCalledTimes(1);
    modelFound = await StubModel.findByPk(model.id);
    expect(model.id).toBe(modelFound.id);
  });

  test("make method", async () => {
    let model = StubModel.factory().make();
    expect(model).toBeInstanceOf(StubModel);
    expect(UUIDValidate(model.id)).toBeTruthy();
    expect(model.name).not.toBeNull();
    expect(StubModel.mockFactory).toBeCalledTimes(1);
    model = StubModel.factory().make({
      id: "5457f479-d9aa-4912-9a47-2e886e343f33",
      name: "test",
    });
    expect(model.toJSON()).toStrictEqual({
      id: "5457f479-d9aa-4912-9a47-2e886e343f33",
      name: "test",
    });
    expect(StubModel.mockFactory).toBeCalledTimes(1);
    const found = await StubModel.findByPk(model.id);
    expect(found).toBeNull();
  });

  test("bulkCreate method using count = 1", async () => {
    let models = await StubModel.factory().bulkCreate();
    expect(models).toBeInstanceOf(Array);
    expect(models.length).toBe(1);
    expect(models[0]).toBeInstanceOf(StubModel);
    expect(UUIDValidate(models[0].id)).toBeTruthy();
    expect(models[0].name).not.toBeNull();
    expect(StubModel.mockFactory).toBeCalledTimes(1);
    let modelFound = await StubModel.findByPk(models[0].id);
    expect(models[0].toJSON()).toStrictEqual(modelFound.toJSON());
    models = await StubModel.factory().bulkCreate((index) => ({
      id: "5457f479-d9aa-4912-9a47-2e886e343f33",
      name: `test${index}`,
    }));
    expect(models.length).toBe(1);
    expect(models[0].id).toBe("5457f479-d9aa-4912-9a47-2e886e343f33");
    expect(models[0].name).toBe("test0");
    expect(StubModel.mockFactory).toBeCalledTimes(1);
    modelFound = await StubModel.findByPk(models[0].id);
    expect(models[0].toJSON()).toStrictEqual(modelFound.toJSON());
  });

  test("bulkCreate method using count > 1", async () => {
    let models = await StubModel.factory().count(5).bulkCreate();
    expect(models).toBeInstanceOf(Array);
    expect(models.length).toBe(5);
    expect(StubModel.mockFactory).toBeCalledTimes(5);
    for (const model of models) {
      models.forEach((model) => {
        expect(model).toBeInstanceOf(StubModel);
        expect(UUIDValidate(model.id)).toBeTruthy();
        expect(model.name).not.toBeNull();
      });
      let modelFound = await StubModel.findByPk(model.id);
      expect(model.toJSON()).toStrictEqual(modelFound.toJSON());
    }
    models = await StubModel.factory().bulkCreate((index) => ({
      id: `${index}457f479-d9aa-4912-9a47-2e886e343f33`,
      name: `test${index}`,
    }));
    expect(StubModel.mockFactory).toBeCalledTimes(5);
    for (const [index, model] of models.entries()) {
      expect(models.length).toBe(1);
      expect(model.toJSON()).toStrictEqual({
        id: `${index}457f479-d9aa-4912-9a47-2e886e343f33`,
        name: `test${index}`,
      });
      let modelFound = await StubModel.findByPk(model.id);
      expect(model.toJSON()).toStrictEqual(modelFound.toJSON());
    }
  });

  test("bulkMake method using count = 1", async () => {
    let models = StubModel.factory().bulkMake();
    expect(models).toBeInstanceOf(Array);
    expect(models.length).toBe(1);
    expect(models[0]).toBeInstanceOf(StubModel);
    expect(UUIDValidate(models[0].id)).toBeTruthy();
    expect(models[0].name).not.toBeNull();
    expect(StubModel.mockFactory).toBeCalledTimes(1);
    let modelFound = await StubModel.findByPk(models[0].id);
    expect(modelFound).toBeNull();
    models = StubModel.factory().bulkMake((index) => ({
      id: "5457f479-d9aa-4912-9a47-2e886e343f33",
      name: `test${index}`,
    }));
    expect(models.length).toBe(1);
    expect(models[0].id).toBe("5457f479-d9aa-4912-9a47-2e886e343f33");
    expect(models[0].name).toBe("test0");
    expect(StubModel.mockFactory).toBeCalledTimes(1);
    modelFound = await StubModel.findByPk(models[0].id);
    expect(modelFound).toBeNull();
  });

  test("bulkMake method using count > 1", async () => {
    let models = StubModel.factory().count(5).bulkMake();
    expect(models).toBeInstanceOf(Array);
    expect(models.length).toBe(5);
    expect(StubModel.mockFactory).toBeCalledTimes(5);
    for (const model of models) {
      models.forEach((model) => {
        expect(model).toBeInstanceOf(StubModel);
        expect(UUIDValidate(model.id)).toBeTruthy();
        expect(model.name).not.toBeNull();
      });
      let modelFound = await StubModel.findByPk(model.id);
      expect(modelFound).toBeNull();
    }
    models = StubModel.factory().bulkMake((index) => ({
      id: `${index}457f479-d9aa-4912-9a47-2e886e343f33`,
      name: `test${index}`,
    }));
    expect(StubModel.mockFactory).toBeCalledTimes(5);
    for (const [index, model] of models.entries()) {
      expect(models.length).toBe(1);
      expect(model.toJSON()).toStrictEqual({
        id: `${index}457f479-d9aa-4912-9a47-2e886e343f33`,
        name: `test${index}`,
      });
      let modelFound = await StubModel.findByPk(model.id);
      expect(modelFound).toBeNull();
    }
  });
});
