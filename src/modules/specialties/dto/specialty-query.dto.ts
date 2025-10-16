import { IsOptional, IsString } from 'class-validator'

export class SpecialtyQueryDto {
	@IsOptional()
	@IsString()
	healthInsurance?: string

	@IsOptional()
	@IsString()
	location?: string

	@IsOptional()
	@IsString()
	plan?: string

	@IsOptional()
	@IsString()
	professional?: string
}
