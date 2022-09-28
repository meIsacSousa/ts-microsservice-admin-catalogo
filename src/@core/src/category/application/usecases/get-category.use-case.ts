import { UseCase as DefaultUseCase } from "#seedwork/application";
import { CategoryRepository } from "../../domain";
import { CategoryOutput, CategoryOutputMapper } from "../dto";

export namespace GetCategoryUseCase {
  // verbo - substantivo - sufixo
  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private categoryRepo: CategoryRepository.Repository) {}
    async execute(input: Input): Promise<Output> {
      const entity = await this.categoryRepo.findById(input.id);
      return CategoryOutputMapper.toOutput(entity);
    }
  }

  // DTO - Data Transfer Object
  export type Input = {
    id: string;
  };

  export type Output = CategoryOutput;
}
