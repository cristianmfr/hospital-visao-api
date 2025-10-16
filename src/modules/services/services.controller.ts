import {
	Controller,
	Get,
	NotFoundException,
	Param,
	ParseIntPipe,
	Query,
} from '@nestjs/common'
import { ServiceQueryDto } from './dto/service-query.dto'
import { ServiceResponseDto } from './dto/service-response.dto'
import { ServicesService } from './services.service'

@Controller('services')
export class ServicesController {
	constructor(private readonly servicesService: ServicesService) {}

	@Get()
	async findAll(
		@Query() query: ServiceQueryDto,
	): Promise<ServiceResponseDto[]> {
		return this.servicesService.findAll(query)
	}

	@Get(':id')
	async findOne(
		@Param('id', ParseIntPipe) id: number,
	): Promise<ServiceResponseDto> {
		const service = await this.servicesService.findOne(id)

		if (!service) {
			throw new NotFoundException(`Service with ID ${id} not found`)
		}

		return service
	}
}
