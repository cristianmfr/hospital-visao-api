import {
	Controller,
	Get,
	NotFoundException,
	Param,
	ParseIntPipe,
	Query,
} from '@nestjs/common'
import { SpecialtyQueryDto } from './dto/specialty-query.dto'
import { SpecialtyResponseDto } from './dto/specialty-response.dto'
import { SpecialtiesService } from './specialties.service'

@Controller('specialties')
export class SpecialtiesController {
	constructor(private readonly specialtiesService: SpecialtiesService) {}

	@Get()
	async findAll(
		@Query() query: SpecialtyQueryDto,
	): Promise<SpecialtyResponseDto[]> {
		return this.specialtiesService.findAll(query)
	}

	@Get(':id')
	async findOne(
		@Param('id', ParseIntPipe) id: number,
	): Promise<SpecialtyResponseDto> {
		const specialty = await this.specialtiesService.findOne(id)

		if (!specialty) {
			throw new NotFoundException(`Specialty with ID ${id} not found`)
		}

		return specialty
	}
}
