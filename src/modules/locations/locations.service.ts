import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Client } from '../clients/models/client.model'
import { LocationQueryDto } from './dto/location-query.dto'
import { LocationResponseDto } from './dto/location-response.dto'

@Injectable()
export class LocationsService {
	constructor(
		@InjectRepository(Client)
		private clientRepository: Repository<Client>,
	) {}

	async findAll(query: LocationQueryDto): Promise<LocationResponseDto[]> {
		const queryBuilder = this.clientRepository
			.createQueryBuilder('paciente')
			.select([
				'paciente.pctId',
				'paciente.pctEndereco',
				'paciente.pctComplemento',
				'paciente.pctNumero',
				'paciente.pctBairro',
				'paciente.pctCEP',
			])
			.leftJoin('sys_cidade', 'cidade', 'cidade.cddId = paciente.pctCidade')
			.addSelect('cidade.cddNome', 'cidade_nome')
			.leftJoin('sys_estado', 'estado', 'estado.estId = paciente.pctEstado')
			.addSelect('estado.estSigla', 'estado_sigla')
			.where('paciente.pctSituacao = :situacao', { situacao: 'ATIVO' })
			.andWhere('paciente.pctEndereco IS NOT NULL')
			.andWhere('paciente.pctEndereco != :empty', { empty: '' })

		// Filter by client
		if (query.client) {
			queryBuilder.andWhere('paciente.pctId = :clientId', {
				clientId: query.client,
			})
		}

		// Filter by professional (get locations where this professional has appointments)
		if (query.professional) {
			queryBuilder
				.innerJoin(
					'dad_atendimento',
					'atendimento',
					'atendimento.tdmPaciente = paciente.pctId',
				)
				.andWhere('atendimento.tdmMedico = :medicoId', {
					medicoId: query.professional,
				})
		}

		// Filter by service/specialty (get locations where this specialty has appointments)
		if (query.service || query.specialty) {
			const especialidadeId = query.service || query.specialty
			if (!query.professional) {
				queryBuilder.innerJoin(
					'dad_atendimento',
					'atendimento',
					'atendimento.tdmPaciente = paciente.pctId',
				)
			}
			queryBuilder.andWhere('atendimento.tdmEspecialidade = :especialidadeId', {
				especialidadeId,
			})
		}

		// Group by address to avoid duplicates
		queryBuilder
			.groupBy('paciente.pctEndereco')
			.addGroupBy('paciente.pctComplemento')
			.addGroupBy('paciente.pctNumero')
			.addGroupBy('paciente.pctBairro')
			.addGroupBy('paciente.pctCEP')
			.addGroupBy('paciente.pctId')
			.addGroupBy('cidade.cddNome')
			.addGroupBy('estado.estSigla')

		const locations = await queryBuilder.getRawMany()

		return locations.map((loc) => this.transformLocation(loc))
	}

	async findOne(id: number): Promise<LocationResponseDto | null> {
		const location = await this.clientRepository
			.createQueryBuilder('paciente')
			.select([
				'paciente.pctId',
				'paciente.pctEndereco',
				'paciente.pctComplemento',
				'paciente.pctNumero',
				'paciente.pctBairro',
				'paciente.pctCEP',
			])
			.leftJoin('sys_cidade', 'cidade', 'cidade.cddId = paciente.pctCidade')
			.addSelect('cidade.cddNome', 'cidade_nome')
			.leftJoin('sys_estado', 'estado', 'estado.estId = paciente.pctEstado')
			.addSelect('estado.estSigla', 'estado_sigla')
			.where('paciente.pctId = :id', { id })
			.andWhere('paciente.pctSituacao = :situacao', { situacao: 'ATIVO' })
			.getRawOne()

		if (!location || !location.paciente_pctEndereco) {
			return null
		}

		return this.transformLocation(location)
	}

	private buildFullAddress(loc: any): string {
		const parts: string[] = []

		if (loc.paciente_pctEndereco) {
			parts.push(loc.paciente_pctEndereco)
		}

		if (loc.paciente_pctNumero) {
			parts.push(loc.paciente_pctNumero.toString())
		}

		if (loc.paciente_pctComplemento) {
			parts.push(loc.paciente_pctComplemento)
		}

		if (loc.paciente_pctBairro) {
			parts.push(loc.paciente_pctBairro)
		}

		return parts.join(', ')
	}

	private transformLocation(loc: any): LocationResponseDto {
		return {
			id: loc.paciente_pctId.toString(),
			name: undefined,
			address: this.buildFullAddress(loc),
			city: loc.cidade_nome || undefined,
			state: loc.estado_sigla || undefined,
			cep: loc.paciente_pctCEP || undefined,
			lat: undefined,
			long: undefined,
		}
	}
}
