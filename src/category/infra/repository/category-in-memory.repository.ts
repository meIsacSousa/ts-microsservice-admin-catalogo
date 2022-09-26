import CategoryRepository from "category/domain/repository/category.repository";
import { InMemorySearchableRepository } from "../../../@seedwork/repository/in-memory.repository";
import Category from "../../domain/entities/category";

export default class CategoryInMemoryRepository
  extends InMemorySearchableRepository<Category>
  implements CategoryRepository.Repository
{
  protected async applyFilter(
    items: Category[],
    filter: CategoryRepository.Filter
  ): Promise<Category[]> {
    if (!filter) {
      return items;
    }

    return items.filter((i) => {
      return i.props.name.toLowerCase().includes(filter.toLowerCase());
    });
  }
}
