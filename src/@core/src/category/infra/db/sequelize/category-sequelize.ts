import { SequelizeModelFactory } from "#seedwork/infra";
import {
  Column,
  Table,
  PrimaryKey,
  DataType,
  Model,
} from "sequelize-typescript";
import { Category, CategoryRepository } from "#category/domain";
import {
  NotFoundError,
  UniqueEntityId,
  EntityValidationError,
  LoadEntityError,
} from "#seedwork/domain";
import { Op } from "sequelize";

export namespace CategorySequelize {
  type CategoryModelProps = {
    id: string;
    name: string;
    description: string | null;
    is_active: boolean;
    created_at: Date;
  };

  @Table({ tableName: "categories", timestamps: false })
  export class CategoryModel extends Model<CategoryModelProps> {
    @PrimaryKey
    @Column({ type: DataType.UUID })
    declare id: string;

    @Column({ allowNull: false, type: DataType.STRING(255) })
    declare name: string;

    @Column({ allowNull: true, type: DataType.TEXT })
    declare description: string | null;

    @Column({ allowNull: false, type: DataType.BOOLEAN })
    declare is_active: boolean;

    @Column({ allowNull: false, type: DataType.DATE })
    declare created_at: Date;

    static factory() {
      const chance: Chance.Chance = require("chance")();
      return new SequelizeModelFactory<CategoryModel, CategoryModelProps>(
        CategoryModel,
        () => ({
          id: chance.guid(),
          name: chance.word(),
          description: chance.sentence(),
          is_active: true,
          created_at: chance.date(),
        })
      );
    }
  }

  export class CategoryModelMapper {
    static toEntity(model: CategoryModel): Category {
      const { id, ...otherData } = model.toJSON();
      try {
        return new Category(otherData, new UniqueEntityId(id));
      } catch (error) {
        if (error instanceof EntityValidationError) {
          throw new LoadEntityError(error.errors);
        }
        throw error;
      }
    }
  }

  export class CategorySequelizeRepository
    implements CategoryRepository.Repository
  {
    constructor(private categoryModel: typeof CategoryModel) {}

    sortableFields: string[] = ["name"];

    async insert(entity: Category): Promise<void> {
      await this.categoryModel.create(entity.toJSON());
    }

    async search(
      props: CategoryRepository.SearchParams
    ): Promise<CategoryRepository.SearchResult> {
      const offset = (props.page - 1) * props.per_page;
      const limit = props.per_page;
      const { rows: models, count } = await this.categoryModel.findAndCountAll({
        ...(props.filter && {
          where: { name: { [Op.like]: `%${props.filter}%` } },
        }),
        ...(props.sort && this.sortableFields.includes(props.sort)
          ? {
              order: [[props.sort, props.sort_dir]],
            }
          : {
              order: [["created_at", "DESC"]],
            }),
        limit,
        offset,
      });
      return new CategoryRepository.SearchResult({
        items: models.map((model) => CategoryModelMapper.toEntity(model)),
        total: count,
        current_page: props.page,
        per_page: props.per_page,
        filter: props.filter,
        sort: props.sort,
        sort_dir: props.sort_dir,
      });
    }

    async findAll(): Promise<Category[]> {
      const models = await this.categoryModel.findAll();
      return models.map((model) => CategoryModelMapper.toEntity(model));
    }

    async findById(id: string | UniqueEntityId): Promise<Category> {
      const _id = `${id}`;
      const model = await this._get(_id);
      return CategoryModelMapper.toEntity(model);
    }

    async update(entity: Category): Promise<void> {
      await this._get(entity.id);
      await this.categoryModel.update(entity.toJSON(), {
        where: { id: entity.id },
      });
    }

    async delete(id: string | UniqueEntityId): Promise<void> {
      const _id = `${id}`;
      await this._get(_id);
      await this.categoryModel.destroy({ where: { id: _id } });
    }

    protected async _get(id: string): Promise<CategoryModel> {
      const model = await this.categoryModel.findByPk(id, {
        rejectOnEmpty: new NotFoundError(`Entity Not Found using ID: ${id}`),
      });
      return model;
    }
  }
}
