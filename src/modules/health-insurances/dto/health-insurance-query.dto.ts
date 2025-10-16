import { IsOptional, IsString } from 'class-validator'

export class HealthInsuranceQueryDto {
	@IsOptional()
	@IsString()
	service?: string

	@IsOptional()
	@IsString()
	location?: string

	@IsOptional()
	@IsString()
	professional?: string
}
