import { Controller, Get, Query } from '@nestjs/common'
import { PlanQueryDto } from './dto/plan-query.dto'
import { PlanResponseDto } from './dto/plan-response.dto'
import { PlansService } from './plans.service'

@Controller('plans')
export class PlansController {
	constructor(private readonly plansService: PlansService) {}

	@Get()
	async findAll(@Query() query: PlanQueryDto): Promise<PlanResponseDto[]> {
		return this.plansService.findAll(query)
	}
}
