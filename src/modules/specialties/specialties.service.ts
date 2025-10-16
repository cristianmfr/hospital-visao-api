import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Specialty } from '../professionals/models/specialty.model'
import { SpecialtyQueryDto } from './dto/specialty-query.dto'
import { SpecialtyResponseDto } from './dto/specialty-response.dto'

@Injectable()
export class SpecialtiesService {
	constructor(
		@InjectRepository(Specialty)
		private specialtyRepository: Repository<Specialty>,
	) {}

	async findAll(query: SpecialtyQueryDto): Promise<SpecialtyResponseDto[]> {
		const queryBuilder = this.specialtyRepository
			.createQueryBuilder('especialidade')
			.where('especialidade.spcSituacao = :situacao', { situacao: 'ATIVA' })
			.orderBy('especialidade.spcNome', 'ASC')

		if (query.professional) {
			queryBuilder
				.innerJoin(
					'rlc_medico_especialidade',
					'me',
					'me.mspEspecialidade = especialidade.spcId',
				)
				.andWhere('me.mspMedico = :medicoId', { medicoId: query.professional })
		}

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

		queryBuilder.groupBy('especialidade.spcId')

		const specialties = await queryBuilder.getMany()

		return specialties.map((specialty) => this.transformSpecialty(specialty))
	}

	async findOne(id: number): Promise<SpecialtyResponseDto | null> {
		const specialty = await this.specialtyRepository.findOne({
			where: { spcId: id, spcSituacao: 'ATIVA' },
		})

		if (!specialty) {
			return null
		}

		return this.transformSpecialty(specialty)
	}

	private transformSpecialty(specialty: Specialty): SpecialtyResponseDto {
		return {
			id: specialty.spcId.toString(),
			name: specialty.spcNome,
		}
	}
}
