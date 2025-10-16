import { IsOptional, IsString } from 'class-validator'

export class LocationQueryDto {
	@IsOptional()
	@IsString()
	service?: string

	@IsOptional()
	@IsString()
	professional?: string

	@IsOptional()
	@IsString()
	specialty?: string

	@IsOptional()
	@IsString()
	client?: string
}
