import {
	Body,
	Controller,
	Get,
	NotFoundException,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	Query,
} from '@nestjs/common'
import { ClientsService } from './clients.service'
import { ClientQueryDto, ClientSearchDto } from './dto/client-query.dto'
import { ClientResponseDto } from './dto/client-response.dto'
import { CreateClientDto } from './dto/create-client.dto'
import { UpdateClientDto } from './dto/update-client.dto'

@Controller('clients')
export class ClientsController {
	constructor(private readonly clientsService: ClientsService) {}

	@Get()
	async findAll(@Query() query: ClientQueryDto): Promise<ClientResponseDto[]> {
		return this.clientsService.findAll(query)
	}

	@Get('search')
	async search(@Query() query: ClientSearchDto): Promise<ClientResponseDto[]> {
		return this.clientsService.search(query)
	}

	@Get(':id')
	async findOne(
		@Param('id', ParseIntPipe) id: number,
	): Promise<ClientResponseDto> {
		const client = await this.clientsService.findOne(id)

		if (!client) {
			throw new NotFoundException(`Client with ID ${id} not found`)
		}

		return client
	}

	@Post()
	async create(
		@Body() createClientDto: CreateClientDto,
	): Promise<ClientResponseDto> {
		return this.clientsService.create(createClientDto)
	}

	@Patch(':id')
	async update(
		@Param('id', ParseIntPipe) id: number,
		@Body() updateClientDto: UpdateClientDto,
	): Promise<ClientResponseDto> {
		return this.clientsService.update(id, updateClientDto)
	}
}
