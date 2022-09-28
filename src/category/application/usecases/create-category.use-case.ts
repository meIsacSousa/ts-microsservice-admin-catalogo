import { CategoryRepository, Category } from "../../domain";
import { CategoryOutput, CategoryOutputMapper } from "../dto";
import { UseCase } from "#seedwork/application";

// verbo - substantivo - sufixo
export class CreateCategoryUseCase implements UseCase<Input, Output> {
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
