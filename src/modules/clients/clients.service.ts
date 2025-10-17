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

		const limit = query.limit || 100
		queryBuilder.take(limit)

		if (query.offset) {
			queryBuilder.skip(query.offset)
		}

		try {
			const clients = await queryBuilder.getMany()
			return clients.map((client) => this.transformClient(client))
		} catch (error) {
			console.error('Error finding clients:', error)
			throw error
		}
	}

	async search(searchDto: ClientSearchDto): Promise<ClientResponseDto[]> {
		const queryBuilder = this.clientRepository
			.createQueryBuilder('paciente')
			.where('paciente.pctSituacao = :situacao', { situacao: 'ATIVO' })

		const cleanTerm = searchDto.term.replace(/\D/g, '')
		if (cleanTerm.length > 0 && /^\d+$/.test(cleanTerm)) {
			queryBuilder.andWhere(
				'(paciente.pctTelefone LIKE :phone OR paciente.pctCelular LIKE :phone)',
				{ phone: `%${cleanTerm}%` },
			)
		} else {
			queryBuilder.andWhere(
				'(paciente.pctCPF = :term OR paciente.pctEmail = :term)',
				{ term: searchDto.term },
			)
		}

		const limit = searchDto.limit || 50
		queryBuilder.take(limit)

		if (searchDto.offset) {
			queryBuilder.skip(searchDto.offset)
		}

		try {
			const clients = await queryBuilder.getMany()
			return clients.map((client) => this.transformClient(client))
		} catch (error) {
			console.error('Error searching clients:', error)
			throw error
		}
	}

	async findOne(id: number): Promise<ClientResponseDto | null> {
		try {
			const client = await this.clientRepository.findOne({
				where: { pctId: id, pctSituacao: 'ATIVO' },
			})

			if (!client) {
				return null
			}

			return this.transformClient(client)
		} catch (error) {
			console.error('Error finding client by id:', error)
			throw error
		}
	}

	async create(createClientDto: CreateClientDto): Promise<ClientResponseDto> {
		try {
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
		} catch (error) {
			console.error('Error creating client:', error)
			throw error
		}
	}

	async update(
		id: number,
		updateClientDto: UpdateClientDto,
	): Promise<ClientResponseDto> {
		try {
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
		} catch (error) {
			if (error instanceof NotFoundException) {
				throw error
			}
			console.error('Error updating client:', error)
			throw error
		}
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
