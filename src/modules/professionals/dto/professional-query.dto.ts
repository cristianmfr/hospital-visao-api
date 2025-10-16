import { Transform } from 'class-transformer'
import { IsBoolean, IsOptional, IsString } from 'class-validator'

export class ProfessionalQueryDto {
	@IsOptional()
	@IsString()
	location?: string

	@IsOptional()
	@IsString()
	service?: string

	@IsOptional()
	@IsString()
	healthInsurance?: string

	@IsOptional()
	@IsString()
	specialty?: string

	@IsOptional()
	@Transform(({ value }) => {
		if (value === 'true') return true
		if (value === 'false') return false
		return value
	})
	@IsBoolean()
	enabled?: boolean
}
