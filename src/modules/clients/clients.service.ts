import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ClientQueryDto, ClientSearchDto } from './dto/client-query.dto'
import { ClientResponseDto } from './dto/client-response.dto'
import { CreateClientDto } from './dto/create-client.dto'
import { UpdateClientDto } from './dto/update-client.dto'
import { Client } from './models/client.model'

@Injectable()
export class ClientsService {
	constructor(
		@InjectRepository(Client)
		private clientRepository: Repository<Client>,
	) {}

	async findAll(query: ClientQueryDto): Promise<ClientResponseDto[]> {
		const queryBuilder = this.clientRepository
			.createQueryBuilder('paciente')
			.where('paciente.pctSituacao = :situacao', { situacao: 'ATIVO' })
			.orderBy('paciente.pctNome', 'ASC')

		if (query.limit) {
			queryBuilder.take(query.limit)
		}

		if (query.offset) {
			queryBuilder.skip(query.offset)
		}

		const clients = await queryBuilder.getMany()

		return clients.map((client) => this.transformClient(client))
	}

	async search(searchDto: ClientSearchDto): Promise<ClientResponseDto[]> {
		const queryBuilder = this.clientRepository
			.createQueryBuilder('paciente')
			.where('paciente.pctSituacao = :situacao', { situacao: 'ATIVO' })

		const cleanTerm = searchDto.term.replace(/\D/g, '')
		if (cleanTerm.length > 0 && /^\d+$/.test(cleanTerm)) {
			queryBuilder.andWhere(
				'(REPLACE(REPLACE(REPLACE(REPLACE(paciente.pctTelefone, "(", ""), ")", ""), "-", ""), " ", "") = :phone OR REPLACE(REPLACE(REPLACE(REPLACE(paciente.pctCelular, "(", ""), ")", ""), "-", ""), " ", "") = :phone)',
				{ phone: cleanTerm },
			)
		} else {
			queryBuilder.andWhere(
				'(paciente.pctCPF = :term OR paciente.pctEmail = :term)',
				{ term: searchDto.term },
			)
		}

		if (searchDto.limit) {
			queryBuilder.take(searchDto.limit)
		}

		if (searchDto.offset) {
			queryBuilder.skip(searchDto.offset)
		}

		const clients = await queryBuilder.getMany()

		return clients.map((client) => this.transformClient(client))
	}

	async findOne(id: number): Promise<ClientResponseDto | null> {
		const client = await this.clientRepository.findOne({
			where: { pctId: id, pctSituacao: 'ATIVO' },
		})

		if (!client) {
			return null
		}

		return this.transformClient(client)
	}

	async create(createClientDto: CreateClientDto): Promise<ClientResponseDto> {
		const client = this.clientRepository.create({
			pctNome: createClientDto.name,
			pctTelefone: createClientDto.phone,
			pctCelular: createClientDto.phone,
			pctEmail: createClientDto.email,
			pctNascimento: createClientDto.birthday,
			pctCPF: createClientDto.cpf,
			pctSituacao: 'ATIVO',
			pctAlteracaoData: new Date(),
		})

		const savedClient = await this.clientRepository.save(client)

		return this.transformClient(savedClient)
	}

	async update(
		id: number,
		updateClientDto: UpdateClientDto,
	): Promise<ClientResponseDto> {
		const client = await this.clientRepository.findOne({
			where: { pctId: id, pctSituacao: 'ATIVO' },
		})

		if (!client) {
			throw new NotFoundException(`Client with ID ${id} not found`)
		}

		if (updateClientDto.name) {
			client.pctNome = updateClientDto.name
		}

		if (updateClientDto.email) {
			client.pctEmail = updateClientDto.email
		}

		if (updateClientDto.cpf) {
			client.pctCPF = updateClientDto.cpf
		}

		if (updateClientDto.birthday) {
			client.pctNascimento = updateClientDto.birthday
		}

		client.pctAlteracaoData = new Date()

		const updatedClient = await this.clientRepository.save(client)

		return this.transformClient(updatedClient)
	}

	private removePhoneFormatting(phone: string): string {
		if (!phone) return ''
		return phone.replace(/\D/g, '')
	}

	private formatCPF(cpf: string): string {
		if (!cpf) return ''
		const clean = cpf.replace(/\D/g, '')
		if (clean.length === 11) {
			return `${clean.slice(0, 3)}.${clean.slice(3, 6)}.${clean.slice(6, 9)}-${clean.slice(9)}`
		}
		return cpf
	}

	private transformClient(client: Client): ClientResponseDto {
		const allPhones: string[] = []

		if (client.pctTelefone) {
			const cleanPhone = this.removePhoneFormatting(client.pctTelefone)
			if (cleanPhone) allPhones.push(cleanPhone)
		}

		if (client.pctCelular) {
			const cleanCelular = this.removePhoneFormatting(client.pctCelular)
			if (cleanCelular && !allPhones.includes(cleanCelular)) {
				allPhones.push(cleanCelular)
			}
		}

		return {
			id: client.pctId.toString(),
			name: client.pctNome,
			description: undefined,
			phone: allPhones[0] || undefined,
			allPhones: allPhones.length > 0 ? allPhones : undefined,
			cpf: client.pctCPF ? this.formatCPF(client.pctCPF) : undefined,
			image: undefined,
			email: client.pctEmail || undefined,
			birthday: client.pctNascimento || undefined,
			externalId: client.pctPixeOn || undefined,
		}
	}
}
