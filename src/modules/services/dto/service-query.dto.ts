import { Transform } from 'class-transformer'
import { IsBoolean, IsOptional, IsString } from 'class-validator'

export class ServiceQueryDto {
	@IsOptional()
	@IsString()
	location?: string

	@IsOptional()
	@IsString()
	professional?: string

	@IsOptional()
	@IsString()
	healthInsurance?: string

	@IsOptional()
	@IsString()
	specialty?: string

	@IsOptional()
	@IsString()
	plan?: string

	@IsOptional()
	@IsString()
	client?: string

	@IsOptional()
	@Transform(({ value }) => {
		if (value === 'true') return true
		if (value === 'false') return false
		return value
	})
	@IsBoolean()
	enabled?: boolean
}
