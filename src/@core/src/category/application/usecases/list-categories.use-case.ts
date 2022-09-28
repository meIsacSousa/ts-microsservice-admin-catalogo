import { CategoryRepository } from "../../domain";
import {
  UseCase as DefaultUseCase,
  SearchInputDto,
  PaginationOutputDto,
  PaginationOutputMapper,
} from "#seedwork/application";
import { CategoryOutput, CategoryOutputMapper } from "../dto";

export namespace ListCategoriesUseCase {
  export class UseCase implements DefaultUseCase<Input, Output> {
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

  export type Input = SearchInputDto;

  export type Output = PaginationOutputDto<CategoryOutput>;
}
