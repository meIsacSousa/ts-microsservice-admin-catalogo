import { UseCase } from "#seedwork/application";
import { CategoryRepository } from "../../domain";

export class DeleteCategoryUseCase implements UseCase<Input, Output> {
  constructor(private categoryRepository: CategoryRepository.Repository) {}

  async execute(input: Input): Promise<Output> {
    const entity = await this.categoryRepository.findById(input.id);
    await this.categoryRepository.delete(entity.id);
  }
}

export default DeleteCategoryUseCase;

export type Input = {
  id: string;
};

export type Output = void;
