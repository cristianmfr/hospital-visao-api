import { Controller, Get, Query } from '@nestjs/common'
import { ScheduleQueryDto } from './dto/schedule-query.dto'
import { ScheduleResponseDto } from './dto/schedule-response.dto'
import { ScheduleService } from './schedule.service'

@Controller('schedule')
export class ScheduleController {
	constructor(private readonly scheduleService: ScheduleService) {}

	@Get()
	async getAvailableSchedule(
		@Query() query: ScheduleQueryDto,
	): Promise<ScheduleResponseDto> {
		return this.scheduleService.getAvailableSchedule(query)
	}
}
