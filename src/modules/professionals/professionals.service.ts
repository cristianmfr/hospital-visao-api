import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ProfessionalQueryDto } from './dto/professional-query.dto'
import { ProfessionalResponseDto } from './dto/professional-response.dto'
import { SpecialtyDto } from './dto/specialty.dto'
import { Professional } from './models/professional.model'
import { Specialty } from './models/specialty.model'

@Injectable()
export class ProfessionalsService {
	constructor(
		@InjectRepository(Professional)
		private professionalRepository: Repository<Professional>,
		@InjectRepository(Specialty)
		private specialtyRepository: Repository<Specialty>,
	) {}

	async findAll(
		query: ProfessionalQueryDto,
	): Promise<ProfessionalResponseDto[]> {
		const queryBuilder = this.professionalRepository
			.createQueryBuilder('medico')
			.orderBy('medico.mdcNome', 'ASC')

		if (query.enabled !== undefined) {
			const situacao = query.enabled ? 'ATIVO' : 'INATIVO'
			queryBuilder.where('medico.mdcSituacao = :situacao', { situacao })
		} else {
			queryBuilder.where('medico.mdcSituacao = :situacao', {
				situacao: 'ATIVO',
			})
		}

		if (query.location) {
			queryBuilder
				.innerJoin(
					'dad_atendimento',
					'atendimento',
					'atendimento.tdmMedico = medico.mdcId',
				)
				.andWhere('atendimento.tdmPaciente = :pacienteId', {
					pacienteId: query.location,
				})
		}

		if (query.service || query.specialty) {
			const especialidadeId = query.service || query.specialty
			queryBuilder
				.innerJoin(
					'rlc_medico_especialidade',
					'me',
					'me.mspMedico = medico.mdcId',
				)
				.andWhere('me.mspEspecialidade = :especialidadeId', {
					especialidadeId,
				})
		}

		if (query.healthInsurance) {
			queryBuilder
				.innerJoin('rlc_medico_convenio', 'mc', 'mc.mcvMedico = medico.mdcId')
				.andWhere('mc.mcvConvenio = :convenioId', {
					convenioId: query.healthInsurance,
				})
		}

		queryBuilder.groupBy('medico.mdcId')

		const professionals = await queryBuilder.getMany()

		const professionalsWithSpecialties = await Promise.all(
			professionals.map(async (prof) => {
				const specialties = await this.getSpecialtiesForProfessional(prof.mdcId)
				return this.transformProfessional(prof, specialties)
			}),
		)

		return professionalsWithSpecialties
	}

	async findOne(id: number): Promise<ProfessionalResponseDto | null> {
		const professional = await this.professionalRepository.findOne({
			where: { mdcId: id, mdcSituacao: 'ATIVO' },
		})

		if (!professional) {
			return null
		}

		const specialties = await this.getSpecialtiesForProfessional(id)

		return this.transformProfessional(professional, specialties)
	}

	private async getSpecialtiesForProfessional(
		professionalId: number,
	): Promise<Specialty[]> {
		const specialties = await this.specialtyRepository
			.createQueryBuilder('especialidade')
			.innerJoin(
				'rlc_medico_especialidade',
				'me',
				'me.mspEspecialidade = especialidade.spcId',
			)
			.where('me.mspMedico = :medicoId', { medicoId: professionalId })
			.andWhere('especialidade.spcSituacao = :situacao', { situacao: 'ATIVA' })
			.getMany()

		return specialties
	}

	private transformProfessional(
		professional: Professional,
		specialties: Specialty[],
	): ProfessionalResponseDto {
		const crm = professional.mdcCRM
			? `CRM ${professional.mdcCRM}${professional.mdcCRMEstado ? ` ${professional.mdcCRMEstado}` : ''}`
			: undefined

		const specialtiesDto: SpecialtyDto[] = specialties.map((s) => ({
			id: s.spcId.toString(),
			name: s.spcNome,
		}))

		return {
			id: professional.mdcId.toString(),
			name: professional.mdcNome,
			description: professional.mdcObservacao || undefined,
			image: undefined,
			expertise: specialties.length > 0 ? specialties[0].spcNome : undefined,
			register: crm,
			specialties: specialtiesDto.length > 0 ? specialtiesDto : undefined,
		}
	}
}
