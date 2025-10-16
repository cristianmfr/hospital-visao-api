import {
	Controller,
	Get,
	NotFoundException,
	Param,
	ParseIntPipe,
	Query,
} from '@nestjs/common'
import { LocationQueryDto } from './dto/location-query.dto'
import { LocationResponseDto } from './dto/location-response.dto'
import { LocationsService } from './locations.service'

@Controller('locations')
export class LocationsController {
	constructor(private readonly locationsService: LocationsService) {}

	@Get()
	async findAll(
		@Query() query: LocationQueryDto,
	): Promise<LocationResponseDto[]> {
		return this.locationsService.findAll(query)
	}

	@Get(':id')
	async findOne(
		@Param('id', ParseIntPipe) id: number,
	): Promise<LocationResponseDto> {
		const location = await this.locationsService.findOne(id)

		if (!location) {
			throw new NotFoundException(`Location with ID ${id} not found`)
		}

		return location
	}
}
