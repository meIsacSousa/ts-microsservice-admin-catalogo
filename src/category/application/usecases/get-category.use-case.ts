import { UseCase } from "#seedwork/application";
import { CategoryRepository } from "../../domain";
import { CategoryOutput, CategoryOutputMapper } from "../dto";

// verbo - substantivo - sufixo
export class GetCategoryUseCase implements UseCase<Input, Output> {
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
