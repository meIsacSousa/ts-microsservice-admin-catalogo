import { UseCase } from "#seedwork/application";
import { CategoryRepository } from "../../domain";
import { CategoryOutputMapper } from "../dto";

export class UpdateCategoryUseCase implements UseCase<Input, Output> {
  constructor(private categoryRepo: CategoryRepository.Repository) {}

  async execute(input: Input): Promise<Output> {
    const entity = await this.categoryRepo.findById(input.id);
    entity.update(input.name, input.description);
    if (input.is_active === true) {
      entity.activate();
    }
    if (input.is_active === false) {
      entity.deactivate();
    }
    await this.categoryRepo.update(entity);
    return CategoryOutputMapper.toOutput(entity);
  }
}

export type Input = {
  id: string;
  name: string;
  description?: string;
  is_active?: boolean;
};

export type Output = {};
