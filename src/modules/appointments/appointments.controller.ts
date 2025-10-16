import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	NotFoundException,
	Param,
	ParseIntPipe,
	Patch,
	Query,
} from '@nestjs/common'
import { AppointmentsService } from './appointments.service'
import { AppointmentsQueryDto } from './dto/appointments-query.dto'
import { AppointmentResponseDto } from './dto/appointments-response.dto'
import { UpdateAppointmentStateDto } from './dto/update-appointment-state.dto'

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

	@Patch(':id/state')
	@HttpCode(HttpStatus.OK)
	async updateState(
		@Param('id', ParseIntPipe) id: number,
		@Body() updateStateDto: UpdateAppointmentStateDto,
	): Promise<string> {
		await this.appointmentsService.updateState(id, updateStateDto)
		return 'Appointment state updated successfully'
	}
}
