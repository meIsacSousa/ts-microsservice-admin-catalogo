import { SortDirection } from "../../../@seedwork/domain/repository/repository-contracts";
import CategoryRepository from "category/domain/repository/category.repository";
import { InMemorySearchableRepository } from "../../../@seedwork//domain/repository/in-memory.repository";
import Category from "../../domain/entities/category";

export default class CategoryInMemoryRepository
  extends InMemorySearchableRepository<Category>
  implements CategoryRepository.Repository
{
  sortableFields: string[] = ["name"];
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

  protected async applySort(
    items: Category[],
    sort: string | null,
    sort_dir: SortDirection | null
  ): Promise<Category[]> {
    // should retorn the items in the created_at order if sort is empty
    if (!sort || !this.sortableFields.includes(sort)) {
      return [...items].sort((a, b) => {
        return a.props.created_at.getTime() - b.props.created_at.getTime();
      });
    }
    return super.applySort(items, sort, sort_dir);
  }
}
