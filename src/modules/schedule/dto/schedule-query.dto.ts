import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator'

export class ScheduleQueryDto {
	@IsNotEmpty()
	@IsString()
	@Matches(/^\d{4}-\d{2}-\d{2}$/, {
		message: 'start must be in format YYYY-MM-DD',
	})
	start: string

	@IsNotEmpty()
	@IsString()
	@Matches(/^\d{4}-\d{2}-\d{2}$/, {
		message: 'end must be in format YYYY-MM-DD',
	})
	end: string

	@IsOptional()
	@IsString()
	professional?: string

	@IsOptional()
	@IsString()
	service?: string

	@IsOptional()
	@IsString()
	location?: string

	@IsOptional()
	@IsString()
	healthInsurance?: string

	@IsOptional()
	@IsString()
	specialty?: string

	@IsOptional()
	@IsString()
	client?: string

	@IsOptional()
	@IsString()
	plan?: string
}
