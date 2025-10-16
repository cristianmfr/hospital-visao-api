import { Injectable } from '@nestjs/common'
import { format, parseISO } from 'date-fns'
import { AppointmentsQueryDto } from './dto/appointments-query.dto'
import { AppointmentResponseDto } from './dto/appointments-response.dto'
import { CreateAppointmentDto } from './dto/create-appointment.dto'
import {
	AppointmentState,
	UpdateAppointmentStateDto,
} from './dto/update-appointment-state.dto'
import { SmartApiService } from './smart-api.service'

@Injectable()
export class AppointmentsService {
	constructor(private smartApiService: SmartApiService) {}

	async findAll(
		query: AppointmentsQueryDto,
	): Promise<AppointmentResponseDto[]> {
		const startDate = query.start || query.date || '2030-01-01'
		const endDate = query.end || query.date || '2000-01-01'

		const pacienteId = query.client ? Number.parseInt(query.client) : undefined
		const response = await this.smartApiService.getAppointments(
			startDate,
			endDate,
			pacienteId,
		)

		let appointments = response.Agendamentos || []

		if (query.hour) {
			appointments = appointments.filter((apt) => {
				const startDateTime = apt.DataHoraIni || apt.DtmarcacaoIni
				if (!startDateTime) return false
				const startTime = parseISO(startDateTime)
				return format(startTime, 'HH:mm') === query.hour
			})
		}

		if (query.endHour) {
			appointments = appointments.filter((apt) => {
				const endDateTime = apt.DataHoraFim || apt.DtmarcacaoFim
				if (!endDateTime) return false
				const endTime = parseISO(endDateTime)
				return format(endTime, 'HH:mm') === query.endHour
			})
		}

		if (query.location) {
			appointments = appointments.filter((apt) => {
				const location = (
					apt.UnidadeNome ||
					apt.LocalDescricao ||
					apt.UnidadeEndereco ||
					''
				).toLowerCase()
				return location.includes(query.location?.toLowerCase() || '')
			})
		}

		if (query.state) {
			appointments = appointments.filter((apt) => {
				let state = 'PENDING'
				if (apt.StatusConfirmacao === 'C') {
					state = 'CONFIRMED'
				} else if (apt.StatusAgendamento === 'C') {
					state = 'CANCELLED'
				} else if (apt.Situacao) {
					state = apt.Situacao
				}
				return state.toUpperCase() === query.state?.toUpperCase()
			})
		}

		return appointments.map((apt) => this.transformSmartAppointment(apt))
	}

	async findOne(id: string): Promise<AppointmentResponseDto | null> {
		const today = format(new Date(), 'yyyy-MM-dd')
		const response = await this.smartApiService.getAppointments(today, today)

		const appointment = response.Agendamentos?.find(
			(apt) => apt.AgmSmkFilho === id,
		)

		if (!appointment) {
			return null
		}

		return this.transformSmartAppointment(appointment)
	}

	async create(
		createDto: CreateAppointmentDto,
	): Promise<AppointmentResponseDto> {
		const result = await this.smartApiService.createAppointment({
			ConvenioId: createDto.healthInsurance,
			PlanoId: createDto.plan,
			MatriculaId: createDto.enrollmentId,
			DtmarcacaoIni: createDto.startDateTime,
			DtmarcacaoFim: createDto.endDateTime,
			PacCep: createDto.zipCode,
			UnidadeId: createDto.location,
			ProcedimentoId: createDto.service,
			ProfissionalExecutanteId: createDto.professional,
			ProfissionalSolicitanteId: createDto.requestingProfessional,
			Observacao: createDto.observation,
			EnderecoColetaDomiciliar: createDto.homeCollectionAddress,
			PacienteId: Number.parseInt(createDto.client),
		})

		return {
			id: result,
			date: createDto.startDateTime.split('T')[0],
			hour: createDto.startDateTime.split('T')[1]?.substring(0, 5) || '',
			endHour: createDto.endDateTime.split('T')[1]?.substring(0, 5) || '',
			state: 'PENDING',
			classification: 'Primeira consulta',
			client: {
				id: createDto.client,
				name: '',
				phone: '',
			},
			location: {
				id: createDto.location,
				address: '',
			},
			professional: {
				id: createDto.professional,
				name: '',
			},
			service: {
				id: createDto.service,
				name: '',
			},
		}
	}

	async updateState(
		id: string,
		updateStateDto: UpdateAppointmentStateDto,
	): Promise<void> {
		if (updateStateDto.state === AppointmentState.CANCELLED) {
			await this.smartApiService.cancelAppointment({})
		} else if (updateStateDto.state === AppointmentState.CONFIRMED) {
			await this.smartApiService.confirmAppointment(id, '')
		}
	}

	private transformSmartAppointment(appointment: any): AppointmentResponseDto {
		const startDateTime = appointment.DataHoraIni || appointment.DtmarcacaoIni
		const endDateTime = appointment.DataHoraFim || appointment.DtmarcacaoFim

		const startTime = parseISO(startDateTime)
		const endTime = parseISO(endDateTime)

		let state = 'PENDING'
		if (appointment.StatusConfirmacao === 'C') {
			state = 'CONFIRMED'
		} else if (appointment.StatusAgendamento === 'C') {
			state = 'CANCELLED'
		} else if (appointment.Situacao) {
			state = appointment.Situacao
		}

		const rawPhone = appointment.PacCelular || appointment.PacFone || ''
		const cleanPhone = rawPhone.replace(/\D/g, '')

		return {
			id:
				appointment.AgendaId ||
				appointment.AgmSmkFilho ||
				appointment.SeqAgmSmkFilho?.toString() ||
				'',
			date: format(startTime, 'yyyy-MM-dd'),
			hour: format(startTime, 'HH:mm'),
			endHour: format(endTime, 'HH:mm'),
			state,
			classification: 'Primeira consulta',
			client: {
				id: appointment.PacienteId || '',
				name: appointment.PacienteNome || '',
				phone: cleanPhone,
			},
			location: {
				id: appointment.UnidadeId || appointment.SmkLocCod || '',
				address:
					appointment.UnidadeEndereco ||
					appointment.LocalDescricao ||
					appointment.UnidadeNome ||
					'',
			},
			professional: {
				id: appointment.ProfissionalExecutanteId || appointment.SmkMedCod || '',
				name:
					appointment.ProfissionalExecutanteDescricao ||
					appointment.ProfissionalNome ||
					'',
			},
			service: {
				id: appointment.ProcedimentoId || appointment.SmkPrcCod || '',
				name: appointment.ProcedimentoDescricao || '',
			},
		}
	}
}
