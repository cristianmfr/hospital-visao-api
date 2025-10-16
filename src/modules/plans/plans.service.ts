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

		// Filter by healthInsurance (return only plans for this health insurance)
		if (query.healthInsurance) {
			queryBuilder.andWhere('convenio.cvnId = :convenioId', {
				convenioId: query.healthInsurance,
			})
		}

		// Filter by professional (return plans accepted by this professional)
		if (query.professional) {
			queryBuilder
				.innerJoin(
					'rlc_medico_convenio',
					'mc',
					'mc.mcvConvenio = convenio.cvnId',
				)
				.andWhere('mc.mcvMedico = :medicoId', { medicoId: query.professional })
		}

		// Note: location filter is not implemented as there's no direct relationship
		// between plans and locations in the database schema

		const plans = await queryBuilder.getMany()

		// In this implementation, we're returning health insurances as plans
		// since the database schema doesn't have a separate plans table
		return plans.map((plan) => this.transformPlan(plan))
	}

	private transformPlan(healthInsurance: HealthInsurance): PlanResponseDto {
		return {
			id: healthInsurance.cvnId.toString(),
			name: healthInsurance.cvnNome,
		}
	}
}
