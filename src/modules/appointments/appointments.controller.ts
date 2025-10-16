import {
	Controller,
	Get,
	NotFoundException,
	Param,
	ParseIntPipe,
	Query,
} from '@nestjs/common'
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

	@Get(':id')
	async findOne(
		@Param('id', ParseIntPipe) id: number,
	): Promise<AppointmentResponseDto> {
		const appointment = await this.appointmentsService.findOne(id)

		if (!appointment) {
			throw new NotFoundException(`Appointment with ID ${id} not found`)
		}

		return appointment
	}
}
