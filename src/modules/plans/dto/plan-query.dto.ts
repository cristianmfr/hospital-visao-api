import { IsOptional, IsString } from 'class-validator'

export class PlanQueryDto {
	@IsOptional()
	@IsString()
	healthInsurance?: string

	@IsOptional()
	@IsString()
	location?: string

	@IsOptional()
	@IsString()
	professional?: string
}
