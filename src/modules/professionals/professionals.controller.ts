import {
	Controller,
	Get,
	NotFoundException,
	Param,
	ParseIntPipe,
	Query,
} from '@nestjs/common'
import { ProfessionalQueryDto } from './dto/professional-query.dto'
import { ProfessionalResponseDto } from './dto/professional-response.dto'
import { ProfessionalsService } from './professionals.service'

@Controller('professionals')
export class ProfessionalsController {
	constructor(private readonly professionalsService: ProfessionalsService) {}

	@Get()
	async findAll(
		@Query() query: ProfessionalQueryDto,
	): Promise<ProfessionalResponseDto[]> {
		return this.professionalsService.findAll(query)
	}

	@Get(':id')
	async findOne(
		@Param('id', ParseIntPipe) id: number,
	): Promise<ProfessionalResponseDto> {
		const professional = await this.professionalsService.findOne(id)

		if (!professional) {
			throw new NotFoundException(`Professional with ID ${id} not found`)
		}

		return professional
	}
}
