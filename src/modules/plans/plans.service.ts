import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { HealthInsurance } from '../health-insurances/models/health-insurance.model'
import { PlanQueryDto } from './dto/plan-query.dto'
import { PlanResponseDto } from './dto/plan-response.dto'

@Injectable()
export class PlansService {
	constructor(
		@InjectRepository(HealthInsurance)
		private healthInsuranceRepository: Repository<HealthInsurance>,
	) {}

	async findAll(query: PlanQueryDto): Promise<PlanResponseDto[]> {
		const queryBuilder = this.healthInsuranceRepository
			.createQueryBuilder('convenio')
			.where('convenio.cvnSituacao = :situacao', { situacao: 'ATIVO' })
			.orderBy('convenio.cvnNome', 'ASC')

		if (query.healthInsurance) {
			queryBuilder.andWhere('convenio.cvnId = :convenioId', {
				convenioId: query.healthInsurance,
			})
		}

		if (query.professional) {
			queryBuilder
				.innerJoin(
					'rlc_medico_convenio',
					'mc',
					'mc.mcvConvenio = convenio.cvnId',
				)
				.andWhere('mc.mcvMedico = :medicoId', { medicoId: query.professional })
		}

		const plans = await queryBuilder.getMany()

		return plans.map((plan) => this.transformPlan(plan))
	}

	private transformPlan(healthInsurance: HealthInsurance): PlanResponseDto {
		return {
			id: healthInsurance.cvnId.toString(),
			name: healthInsurance.cvnNome,
		}
	}
}
