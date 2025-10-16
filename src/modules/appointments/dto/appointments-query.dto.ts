import { IsOptional, IsString, Matches } from 'class-validator'

export class AppointmentsQueryDto {
	@IsOptional()
	@IsString()
	@Matches(/^\d{4}-\d{2}-\d{2}$/, {
		message: 'start must be in format YYYY-MM-DD',
	})
	start?: string

	@IsOptional()
	@IsString()
	@Matches(/^\d{4}-\d{2}-\d{2}$/, {
		message: 'end must be in format YYYY-MM-DD',
	})
	end?: string

	@IsOptional()
	@IsString()
	@Matches(/^\d{4}-\d{2}-\d{2}$/, {
		message: 'date must be in format YYYY-MM-DD',
	})
	date?: string

	@IsOptional()
	@IsString()
	@Matches(/^\d{2}:\d{2}$/, {
		message: 'hour must be in format HH:MM',
	})
	hour?: string

	@IsOptional()
	@IsString()
	@Matches(/^\d{2}:\d{2}$/, {
		message: 'endHour must be in format HH:MM',
	})
	endHour?: string

	@IsOptional()
	@IsString()
	client?: string

	@IsOptional()
	@IsString()
	location?: string

	@IsOptional()
	@IsString()
	state?: string
}
