import CategoryRepository from "../../domain/repository/category.repository";
import UseCase from "@seedwork/application/use-case";
import { CategoryOutput, CategoryOutputMapper } from "../dto/category-output";
import { SearchInputDto } from "@seedwork/application/dto/search-input";
import {
  PaginationOutputDto,
  PaginationOutputMapper,
} from "@seedwork/application/dto/pagination-output";

export type Input = SearchInputDto;

export type Output = PaginationOutputDto<CategoryOutput>;

export default class ListCategoriesUseCase implements UseCase<Input, Output> {
  constructor(private categoryRepo: CategoryRepository.Repository) {}
  async execute(input: Input): Promise<Output> {
    const params = new CategoryRepository.SearchParams(input);
    const searchResult = await this.categoryRepo.search(params);
    return this.toOutput(searchResult);
  }

  private toOutput(searchResult: CategoryRepository.SearchResult) {
    return {
      items: searchResult.items.map((category) =>
        CategoryOutputMapper.toOutput(category)
      ),
      ...PaginationOutputMapper.toOutput(searchResult),
    };
  }
}
