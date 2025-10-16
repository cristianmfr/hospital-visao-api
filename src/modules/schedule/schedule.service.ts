import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import {
	addDays,
	addMinutes,
	eachDayOfInterval,
	format,
	getDay,
	parse,
	parseISO,
} from 'date-fns'
import { Repository } from 'typeorm'
import { Appointment } from '../appointments/models/appointment.model'
import { Professional } from '../professionals/models/professional.model'
import { ScheduleQueryDto } from './dto/schedule-query.dto'
import { ScheduleResponseDto } from './dto/schedule-response.dto'
import { TimeSlotDto } from './dto/time-slot.dto'

interface MedicoAgenda {
	mgdMedico: number
	mgdDiaSemana: number
	mgdHorarioDe: string
	mgdHorarioAte: string
	mgdTempoAtendimento: string
	mgsEspecialidade: number | null
}

@Injectable()
export class ScheduleService {
	constructor(
		@InjectRepository(Professional)
		private professionalRepository: Repository<Professional>,
		@InjectRepository(Appointment)
		private appointmentRepository: Repository<Appointment>,
	) {}

	async getAvailableSchedule(
		query: ScheduleQueryDto,
	): Promise<ScheduleResponseDto> {
		const startDate = parseISO(query.start)
		const endDate = parseISO(query.end)

		// Get all days in the range
		const days = eachDayOfInterval({ start: startDate, end: endDate })

		// Get professional agendas
		const agendas = await this.getProfessionalAgendas(query)

		// Get existing appointments
		const existingAppointments = await this.getExistingAppointments(
			query,
			startDate,
			endDate,
		)

		// Build schedule for each day
		const schedule: ScheduleResponseDto = {}

		for (const day of days) {
			const dateKey = format(day, 'yyyy-MM-dd')
			const dayOfWeek = getDay(day) // 0 = Sunday, 1 = Monday, etc.

			// Get agendas for this day of week
			const dayAgendas = agendas.filter(
				(agenda) => agenda.mgdDiaSemana === dayOfWeek,
			)

			const timeSlots: TimeSlotDto[] = []

			// Generate time slots for each agenda
			for (const agenda of dayAgendas) {
				const slots = this.generateTimeSlotsForAgenda(
					day,
					agenda,
					existingAppointments,
				)
				timeSlots.push(...slots)
			}

			// Sort time slots by start time
			timeSlots.sort((a, b) => a.start.localeCompare(b.start))

			// Remove duplicates
			const uniqueSlots = timeSlots.filter(
				(slot, index, self) =>
					index ===
					self.findIndex(
						(s) => s.start === slot.start && s.end === slot.end,
					),
			)

			schedule[dateKey] = uniqueSlots
		}

		return schedule
	}

	private async getProfessionalAgendas(
		query: ScheduleQueryDto,
	): Promise<MedicoAgenda[]> {
		let queryBuilder = this.professionalRepository
			.createQueryBuilder('medico')
			.innerJoin(
				'rlc_medico_agenda',
				'agenda',
				'agenda.mgdMedico = medico.mdcId',
			)
			.leftJoin(
				'rlc_medico_agenda_especialidade',
				'mgs',
				'mgs.mgsAgenda = agenda.mgdRegistro',
			)
			.where('medico.mdcSituacao = :situacao', { situacao: 'ATIVO' })

		// Filter by professional
		if (query.professional) {
			queryBuilder.andWhere('medico.mdcId = :medicoId', {
				medicoId: query.professional,
			})
		}

		// Filter by specialty/service
		if (query.specialty || query.service) {
			const especialidadeId = query.specialty || query.service
			queryBuilder.andWhere('mgs.mgsEspecialidade = :especialidadeId', {
				especialidadeId,
			})
		}

		// Filter by healthInsurance/plan
		if (query.healthInsurance || query.plan) {
			const convenioId = query.healthInsurance || query.plan
			queryBuilder
				.innerJoin(
					'rlc_medico_convenio',
					'mc',
					'mc.mcvMedico = medico.mdcId',
				)
				.andWhere('mc.mcvConvenio = :convenioId', { convenioId })
		}

		const agendas = await queryBuilder
			.select([
				'agenda.mgdMedico as mgdMedico',
				'agenda.mgdDiaSemana as mgdDiaSemana',
				'agenda.mgdHorarioDe as mgdHorarioDe',
				'agenda.mgdHorarioAte as mgdHorarioAte',
				'agenda.mgdTempoAtendimento as mgdTempoAtendimento',
				'mgs.mgsEspecialidade as mgsEspecialidade',
			])
			.getRawMany()

		return agendas
	}

	private async getExistingAppointments(
		query: ScheduleQueryDto,
		startDate: Date,
		endDate: Date,
	): Promise<Appointment[]> {
		let queryBuilder = this.appointmentRepository
			.createQueryBuilder('atendimento')
			.where('atendimento.tdmData BETWEEN :start AND :end', {
				start: format(startDate, 'yyyy-MM-dd'),
				end: format(endDate, 'yyyy-MM-dd'),
			})
			.andWhere('atendimento.tdmSituacao != :cancelado', {
				cancelado: 'CANCELADO',
			})

		if (query.professional) {
			queryBuilder.andWhere('atendimento.tdmMedico = :medicoId', {
				medicoId: query.professional,
			})
		}

		return queryBuilder.getMany()
	}

	private generateTimeSlotsForAgenda(
		day: Date,
		agenda: MedicoAgenda,
		existingAppointments: Appointment[],
	): TimeSlotDto[] {
		const slots: TimeSlotDto[] = []

		const startTime = parse(agenda.mgdHorarioDe, 'HH:mm:ss', day)
		const endTime = parse(agenda.mgdHorarioAte, 'HH:mm:ss', day)
		const duration = parse(agenda.mgdTempoAtendimento, 'HH:mm:ss', new Date())
		const durationMinutes = duration.getHours() * 60 + duration.getMinutes()

		let currentTime = startTime

		while (currentTime < endTime) {
			const slotEnd = addMinutes(currentTime, durationMinutes)

			if (slotEnd > endTime) break

			const timeKey = format(currentTime, 'HH:mm')
			const dateKey = format(day, 'yyyy-MM-dd')

			// Check if this slot is already booked
			const isBooked = existingAppointments.some((apt) => {
				const aptDate = format(apt.tdmData, 'yyyy-MM-dd')
				const aptTime = apt.tdmHora.substring(0, 5) // Get HH:mm from HH:mm:ss

				return (
					aptDate === dateKey &&
					aptTime === timeKey &&
					apt.tdmMedico === agenda.mgdMedico
				)
			})

			if (!isBooked) {
				slots.push({
					start: format(currentTime, 'HH:mm'),
					end: format(slotEnd, 'HH:mm'),
				})
			}

			currentTime = slotEnd
		}

		return slots
	}
}
