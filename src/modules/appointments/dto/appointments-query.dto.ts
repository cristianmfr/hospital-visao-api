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
}
