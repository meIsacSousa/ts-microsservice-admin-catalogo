import { CategoryRepository, Category } from "../../domain";
import { CategoryOutput, CategoryOutputMapper } from "../dto";
import { UseCase as DefaultUseCase } from "#seedwork/application";

export namespace CreateCategoryUseCase {
  // verbo - substantivo - sufixo
  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private categoryRepo: CategoryRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      const entity = new Category(input);
      await this.categoryRepo.insert(entity);
      return CategoryOutputMapper.toOutput(entity);
    }
  }

  // DTO - Data Transfer Object
  export type Input = {
    name: string;
    description?: string;
    is_active?: boolean;
  };

  export type Output = CategoryOutput;
}
