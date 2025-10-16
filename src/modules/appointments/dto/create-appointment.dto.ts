import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator'

export class CreateAppointmentDto {
	@IsNotEmpty()
	@IsString()
	healthInsurance: string

	@IsOptional()
	@IsString()
	plan?: string

	@IsOptional()
	@IsString()
	enrollmentId?: string

	@IsNotEmpty()
	@IsString()
	@Matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/, {
		message: 'startDateTime must be in format YYYY-MM-DDTHH:mm:ss',
	})
	startDateTime: string

	@IsNotEmpty()
	@IsString()
	@Matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/, {
		message: 'endDateTime must be in format YYYY-MM-DDTHH:mm:ss',
	})
	endDateTime: string

	@IsOptional()
	@IsString()
	zipCode?: string

	@IsNotEmpty()
	@IsString()
	location: string

	@IsNotEmpty()
	@IsString()
	service: string

	@IsNotEmpty()
	@IsString()
	professional: string

	@IsOptional()
	@IsString()
	requestingProfessional?: string

	@IsOptional()
	@IsString()
	observation?: string

	@IsOptional()
	@IsString()
	homeCollectionAddress?: string

	@IsNotEmpty()
	@IsString()
	client: string
}
