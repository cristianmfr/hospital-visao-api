import { Controller, Get, Query } from '@nestjs/common'
import { AppointmentsService } from './appointments.service'
import { AppointmentsQueryDto } from './dto/appointments-query.dto'
import { AppointmentResponseDto } from './dto/appointments-response.dto'

@Controller('appointments')
export class AppointmentsController {
	constructor(private readonly appointmentsService: AppointmentsService) {}

	@Get()
	async findAll(
		@Query() query: AppointmentsQueryDto,
	): Promise<AppointmentResponseDto[]> {
		return this.appointmentsService.findAll(query)
	}
}
