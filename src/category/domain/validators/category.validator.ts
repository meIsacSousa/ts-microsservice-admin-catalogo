import { IsBoolean, IsDate, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";
import ValidatorFields from "../../../@seedwork/domain/validators/class-validator-fields"
import { CategoryProps } from "../entities/category";

export class CategoryRules {
    @MaxLength(255)
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsBoolean()
    @IsOptional()
    is_active: boolean;

    @IsDate()
    @IsOptional()
    created_at: Date;

    constructor({ name, description, is_active, created_at }: CategoryProps) {
        Object.assign(this, { name, description, is_active, created_at });
    }
}


export class CategoryValidator extends ValidatorFields<CategoryRules> {
    validate(data: CategoryProps): boolean {
        return super.validate(new CategoryRules(data ?? {} as any));
    }
}


export default class CategoryValidatorFactory {
    static create(): CategoryValidator {
        return new CategoryValidator();
    }
}