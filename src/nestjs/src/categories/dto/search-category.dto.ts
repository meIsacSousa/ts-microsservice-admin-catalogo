import { ListCategoriesUseCase } from '@fc/micro-videos/category/application';

export class SearchCategoryDto implements ListCategoriesUseCase.Input {
  page?: number;
  per_page?: number;
  sort?: string;
  sor_dir?: string;
  filter?: string;
}
