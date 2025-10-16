import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { HealthInsuranceQueryDto } from './dto/health-insurance-query.dto'
import { HealthInsuranceResponseDto } from './dto/health-insurance-response.dto'
import { HealthInsurance } from './models/health-insurance.model'

@Injectable()
export class HealthInsurancesService {
	constructor(
		@InjectRepository(HealthInsurance)
		private healthInsuranceRepository: Repository<HealthInsurance>,
	) {}

	async findAll(
		query: HealthInsuranceQueryDto,
	): Promise<HealthInsuranceResponseDto[]> {
		const queryBuilder = this.healthInsuranceRepository
			.createQueryBuilder('convenio')
			.where('convenio.cvnSituacao = :situacao', { situacao: 'ATIVO' })
			.orderBy('convenio.cvnNome', 'ASC')

		if (query.professional) {
			queryBuilder
				.innerJoin(
					'rlc_medico_convenio',
					'mc',
					'mc.mcvConvenio = convenio.cvnId',
				)
				.andWhere('mc.mcvMedico = :medicoId', { medicoId: query.professional })
		}

		if (query.service) {
			queryBuilder
				.innerJoin(
					'rlc_medico_convenio_especialidade_valor',
					'mce',
					'mce.msvConvenio = convenio.cvnId',
				)
				.andWhere('mce.msvEspecialidade = :especialidadeId', {
					especialidadeId: query.service,
				})
		}

		const healthInsurances = await queryBuilder.getMany()

		return healthInsurances.map((hi) => this.transformHealthInsurance(hi))
	}

	async findOne(id: number): Promise<HealthInsuranceResponseDto | null> {
		const healthInsurance = await this.healthInsuranceRepository.findOne({
			where: { cvnId: id, cvnSituacao: 'ATIVO' },
		})

		if (!healthInsurance) {
			return null
		}

		return this.transformHealthInsurance(healthInsurance)
	}

	private transformHealthInsurance(
		healthInsurance: HealthInsurance,
	): HealthInsuranceResponseDto {
		return {
			id: healthInsurance.cvnId.toString(),
			name: healthInsurance.cvnNome,
			color: undefined,
		}
	}
}
