import {
	Controller,
	Get,
	NotFoundException,
	Param,
	ParseIntPipe,
	Query,
} from '@nestjs/common'
import { HealthInsuranceQueryDto } from './dto/health-insurance-query.dto'
import { HealthInsuranceResponseDto } from './dto/health-insurance-response.dto'
import { HealthInsurancesService } from './health-insurances.service'

@Controller('health-insurances')
export class HealthInsurancesController {
	constructor(
		private readonly healthInsurancesService: HealthInsurancesService,
	) {}

	@Get()
	async findAll(
		@Query() query: HealthInsuranceQueryDto,
	): Promise<HealthInsuranceResponseDto[]> {
		return this.healthInsurancesService.findAll(query)
	}

	@Get(':id')
	async findOne(
		@Param('id', ParseIntPipe) id: number,
	): Promise<HealthInsuranceResponseDto> {
		const healthInsurance = await this.healthInsurancesService.findOne(id)

		if (!healthInsurance) {
			throw new NotFoundException(`Health insurance with ID ${id} not found`)
		}

		return healthInsurance
	}
}
