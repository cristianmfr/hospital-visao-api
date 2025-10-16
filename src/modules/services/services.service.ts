import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Specialty } from '../professionals/models/specialty.model'
import { ServiceQueryDto } from './dto/service-query.dto'
import { ServiceResponseDto } from './dto/service-response.dto'

@Injectable()
export class ServicesService {
	constructor(
		@InjectRepository(Specialty)
		private specialtyRepository: Repository<Specialty>,
	) {}

	async findAll(query: ServiceQueryDto): Promise<ServiceResponseDto[]> {
		const queryBuilder = this.specialtyRepository
			.createQueryBuilder('especialidade')
			.orderBy('especialidade.spcNome', 'ASC')

		// Filter by enabled status
		if (query.enabled !== undefined) {
			const situacao = query.enabled ? 'ATIVA' : 'INATIVA'
			queryBuilder.where('especialidade.spcSituacao = :situacao', { situacao })
		} else {
			// By default, only return active services
			queryBuilder.where('especialidade.spcSituacao = :situacao', {
				situacao: 'ATIVA',
			})
		}

		// Filter by professional
		if (query.professional) {
			queryBuilder
				.innerJoin(
					'rlc_medico_especialidade',
					'me',
					'me.mspEspecialidade = especialidade.spcId',
				)
				.andWhere('me.mspMedico = :medicoId', { medicoId: query.professional })
		}

		// Filter by healthInsurance or plan
		if (query.healthInsurance || query.plan) {
			const convenioId = query.healthInsurance || query.plan
			queryBuilder
				.innerJoin(
					'rlc_medico_convenio_especialidade_valor',
					'mce',
					'mce.msvEspecialidade = especialidade.spcId',
				)
				.andWhere('mce.msvConvenio = :convenioId', { convenioId })
		}

		// Filter by location (services with appointments at this location)
		if (query.location) {
			queryBuilder
				.innerJoin(
					'dad_atendimento',
					'atendimento',
					'atendimento.tdmEspecialidade = especialidade.spcId',
				)
				.andWhere('atendimento.tdmPaciente = :pacienteId', {
					pacienteId: query.location,
				})
		}

		// Filter by specialty (same as self, so just filter by ID)
		if (query.specialty) {
			queryBuilder.andWhere('especialidade.spcId = :especialidadeId', {
				especialidadeId: query.specialty,
			})
		}

		// Group by to avoid duplicates
		queryBuilder.groupBy('especialidade.spcId')

		const services = await queryBuilder.getMany()

		// Get prices for services if healthInsurance/plan is specified
		const servicesWithPrices = await Promise.all(
			services.map(async (service) => {
				let price: number | undefined = undefined

				if (query.healthInsurance || query.plan) {
					const convenioId = query.healthInsurance || query.plan
					price = await this.getServicePrice(service.spcId, Number(convenioId))
				}

				return this.transformService(service, price)
			}),
		)

		return servicesWithPrices
	}

	async findOne(id: number): Promise<ServiceResponseDto | null> {
		const service = await this.specialtyRepository.findOne({
			where: { spcId: id, spcSituacao: 'ATIVA' },
		})

		if (!service) {
			return null
		}

		return this.transformService(service)
	}

	private async getServicePrice(
		specialtyId: number,
		convenioId: number,
	): Promise<number | undefined> {
		const result = await this.specialtyRepository.query(
			`
			SELECT msvValor
			FROM rlc_medico_convenio_especialidade_valor
			WHERE msvEspecialidade = ? AND msvConvenio = ?
			LIMIT 1
		`,
			[specialtyId, convenioId],
		)

		if (result.length > 0 && result[0].msvValor) {
			return Number(result[0].msvValor)
		}

		return undefined
	}

	private transformService(
		specialty: Specialty,
		price?: number,
	): ServiceResponseDto {
		return {
			id: specialty.spcId.toString(),
			name: specialty.spcNome,
			price: price,
			duration: 30, // Default duration, could be configured per specialty
			description: undefined, // Not available in database
			preparation: undefined, // Not available in database
		}
	}
}
