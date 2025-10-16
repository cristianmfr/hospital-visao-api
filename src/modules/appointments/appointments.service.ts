import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { addMinutes, format, parse } from 'date-fns'
import type { Repository } from 'typeorm'
import { AppointmentsQueryDto } from './dto/appointments-query.dto'
import { AppointmentResponseDto } from './dto/appointments-response.dto'
import {
	AppointmentState,
	UpdateAppointmentStateDto,
} from './dto/update-appointment-state.dto'
import { Appointment } from './models/appointment.model'

@Injectable()
export class AppointmentsService {
	constructor(
		@InjectRepository(Appointment)
		private appointmentRepository: Repository<Appointment>,
	) {}

	async findAll(
		query: AppointmentsQueryDto,
	): Promise<AppointmentResponseDto[]> {
		const queryBuilder = this.appointmentRepository
			.createQueryBuilder('atendimento')
			.leftJoin(
				'dad_paciente',
				'paciente',
				'paciente.pctId = atendimento.tdmPaciente',
			)
			.leftJoin('dad_medico', 'medico', 'medico.mdcId = atendimento.tdmMedico')
			.leftJoin(
				'dad_especialidade',
				'especialidade',
				'especialidade.spcId = atendimento.tdmEspecialidade',
			)

		if (query.start) {
			queryBuilder.andWhere('atendimento.tdmData >= :start', {
				start: query.start,
			})
		}
		if (query.end) {
			queryBuilder.andWhere('atendimento.tdmData <= :end', { end: query.end })
		}

		// Filter by specific date
		if (query.date) {
			queryBuilder.andWhere('atendimento.tdmData = :date', {
				date: query.date,
			})
		}

		// Filter by hour (start time)
		if (query.hour) {
			queryBuilder.andWhere('TIME_FORMAT(atendimento.tdmHora, "%H:%i") = :hour', {
				hour: query.hour,
			})
		}

		// Filter by end hour (start time + 30 minutes)
		if (query.endHour) {
			queryBuilder.andWhere(
				'TIME_FORMAT(ADDTIME(atendimento.tdmHora, "00:30:00"), "%H:%i") = :endHour',
				{
					endHour: query.endHour,
				},
			)
		}

		// Filter by client name (partial match, case-insensitive)
		if (query.client) {
			queryBuilder.andWhere('paciente.pctNome LIKE :client', {
				client: `%${query.client}%`,
			})
		}

		// Filter by location/address (partial match, case-insensitive)
		if (query.location) {
			queryBuilder.andWhere('paciente.pctEndereco LIKE :location', {
				location: `%${query.location}%`,
			})
		}

		// Filter by state (appointment status)
		if (query.state) {
			const stateMap: Record<string, string> = {
				CONFIRMED: 'CONFIRMADO',
				PENDING: 'PENDENTE',
				CANCELLED: 'CANCELADO',
				COMPLETED: 'REALIZADO',
			}
			const dbState = stateMap[query.state.toUpperCase()]
			if (dbState) {
				queryBuilder.andWhere('atendimento.tdmSituacao = :state', {
					state: dbState,
				})
			}
		}

		const appointments = await queryBuilder
			.select([
				'atendimento.tdmId as atendimento_tdmId',
				'atendimento.tdmData as atendimento_tdmData',
				'atendimento.tdmHora as atendimento_tdmHora',
				'atendimento.tdmSituacao as atendimento_tdmSituacao',
				'atendimento.tdmRetorno as atendimento_tdmRetorno',
				'paciente.pctId as paciente_pctId',
				'paciente.pctNome as paciente_pctNome',
				'paciente.pctCPF as paciente_pctCPF',
				'paciente.pctRG as paciente_pctRG',
				'paciente.pctNascimento as paciente_pctNascimento',
				'paciente.pctSexo as paciente_pctSexo',
				'paciente.pctEndereco as paciente_pctEndereco',
				'paciente.pctComplemento as paciente_pctComplemento',
				'paciente.pctNumero as paciente_pctNumero',
				'paciente.pctBairro as paciente_pctBairro',
				'paciente.pctCEP as paciente_pctCEP',
				'paciente.pctTelefone as paciente_pctTelefone',
				'paciente.pctCelular as paciente_pctCelular',
				'paciente.pctEmail as paciente_pctEmail',
				'paciente.pctNomeMae as paciente_pctNomeMae',
				'paciente.pctNomePai as paciente_pctNomePai',
				'paciente.pctProfissao as paciente_pctProfissao',
				'paciente.pctEstadoCivil as paciente_pctEstadoCivil',
				'medico.mdcId as medico_mdcId',
				'medico.mdcNome as medico_mdcNome',
				'especialidade.spcId as especialidade_spcId',
				'especialidade.spcNome as especialidade_spcNome',
			])
			.getRawMany()

		return appointments.map((apt) => this.transformAppointment(apt))
	}

	async findOne(id: number): Promise<AppointmentResponseDto | null> {
		const appointment = await this.appointmentRepository
			.createQueryBuilder('atendimento')
			.leftJoin(
				'dad_paciente',
				'paciente',
				'paciente.pctId = atendimento.tdmPaciente',
			)
			.leftJoin('dad_medico', 'medico', 'medico.mdcId = atendimento.tdmMedico')
			.leftJoin(
				'dad_especialidade',
				'especialidade',
				'especialidade.spcId = atendimento.tdmEspecialidade',
			)
			.where('atendimento.tdmId = :id', { id })
			.select([
				'atendimento.tdmId as atendimento_tdmId',
				'atendimento.tdmData as atendimento_tdmData',
				'atendimento.tdmHora as atendimento_tdmHora',
				'atendimento.tdmSituacao as atendimento_tdmSituacao',
				'atendimento.tdmRetorno as atendimento_tdmRetorno',
				'paciente.pctId as paciente_pctId',
				'paciente.pctNome as paciente_pctNome',
				'paciente.pctCPF as paciente_pctCPF',
				'paciente.pctRG as paciente_pctRG',
				'paciente.pctNascimento as paciente_pctNascimento',
				'paciente.pctSexo as paciente_pctSexo',
				'paciente.pctEndereco as paciente_pctEndereco',
				'paciente.pctComplemento as paciente_pctComplemento',
				'paciente.pctNumero as paciente_pctNumero',
				'paciente.pctBairro as paciente_pctBairro',
				'paciente.pctCEP as paciente_pctCEP',
				'paciente.pctTelefone as paciente_pctTelefone',
				'paciente.pctCelular as paciente_pctCelular',
				'paciente.pctEmail as paciente_pctEmail',
				'paciente.pctNomeMae as paciente_pctNomeMae',
				'paciente.pctNomePai as paciente_pctNomePai',
				'paciente.pctProfissao as paciente_pctProfissao',
				'paciente.pctEstadoCivil as paciente_pctEstadoCivil',
				'medico.mdcId as medico_mdcId',
				'medico.mdcNome as medico_mdcNome',
				'especialidade.spcId as especialidade_spcId',
				'especialidade.spcNome as especialidade_spcNome',
			])
			.getRawOne()

		if (!appointment) {
			return null
		}

		return this.transformAppointment(appointment)
	}

	async updateState(
		id: number,
		updateStateDto: UpdateAppointmentStateDto,
	): Promise<void> {
		const appointment = await this.appointmentRepository.findOne({
			where: { tdmId: id },
		})

		if (!appointment) {
			throw new NotFoundException(`Appointment with ID ${id} not found`)
		}

		const stateMap: Record<AppointmentState, string> = {
			[AppointmentState.CONFIRMED]: 'CONFIRMADO',
			[AppointmentState.PENDING]: 'PENDENTE',
			[AppointmentState.CANCELLED]: 'CANCELADO',
			[AppointmentState.COMPLETED]: 'REALIZADO',
		}

		appointment.tdmSituacao = stateMap[updateStateDto.state]

		await this.appointmentRepository.save(appointment)
	}

	private removePhoneFormatting(phone: string): string {
		if (!phone) return ''
		return phone.replace(/\D/g, '')
	}

	private transformAppointment(data: any): AppointmentResponseDto {
		const startTime = parse(data.atendimento_tdmHora, 'HH:mm:ss', new Date())
		const endTime = addMinutes(startTime, 30)

		return {
			id: data.atendimento_tdmId.toString(),
			date: format(new Date(data.atendimento_tdmData), 'yyyy-MM-dd'),
			hour: format(startTime, 'HH:mm'),
			endHour: format(endTime, 'HH:mm'),
			state: this.mapState(data.atendimento_tdmSituacao),
			classification:
				data.atendimento_tdmRetorno === 'SIM' ? 'Retorno' : 'Primeira consulta',
			client: {
				id: data.paciente_pctId?.toString() || '',
				name: data.paciente_pctNome || '',
				phone: this.removePhoneFormatting(data.paciente_pctTelefone || ''),
			},
			location: {
				id: data.paciente_pctId?.toString() || '',
				address: data.paciente_pctEndereco || '',
			},
			professional: {
				id: data.medico_mdcId?.toString() || '',
				name: data.medico_mdcNome || '',
			},
			service: {
				id: data.especialidade_spcId?.toString() || '',
				name: data.especialidade_spcNome || '',
			},
		}
	}

	private mapState(situacao: string): string {
		const stateMap = {
			CONFIRMADO: 'CONFIRMED',
			PENDENTE: 'PENDING',
			CANCELADO: 'CANCELLED',
			REALIZADO: 'COMPLETED',
		}
		return stateMap[situacao] || 'PENDING'
	}
}
