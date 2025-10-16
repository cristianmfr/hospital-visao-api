import { IsEnum, IsNotEmpty, IsString } from 'class-validator'

export enum AppointmentState {
	CONFIRMED = 'CONFIRMED',
	PENDING = 'PENDING',
	CANCELLED = 'CANCELLED',
	COMPLETED = 'COMPLETED',
}

export class UpdateAppointmentStateDto {
	@IsNotEmpty()
	@IsString()
	@IsEnum(AppointmentState, {
		message:
			'state must be one of: CONFIRMED, PENDING, CANCELLED, COMPLETED',
	})
	state: AppointmentState
}
