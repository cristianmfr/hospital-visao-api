import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import axios, { AxiosInstance } from 'axios'

export interface SmartAppointment {
	SeqAgmSmkFilho?: number
	AgmSmkFilho?: string
	SmkCnvCod?: string
	SmkPlnCod?: string
	SmkPrcCod?: string
	ProcedimentoId?: string
	ProcedimentoDescricao?: string
	ProcedimentoTuss?: string
	ProcedimentoTempo?: string
	ProcedimentoValor?: string
	ConvenioId?: string
	ConvenioNome?: string
	PlanoId?: string
	PlanoNome?: string
	AgendaId?: string
	PacienteId?: string
	PacienteNome?: string
	UnidadeNome?: string
	UnidadeId?: string
	UnidadeEndereco?: string
	EnderecoColetaDomiciliar?: string
	PacFone?: string
	PacCelular?: string
	StatusConfirmacao?: string
	StatusAgendamento?: string
	Contador?: number
	DataHoraIni?: string
	DataHoraFim?: string
	DtmarcacaoIni?: string
	DtmarcacaoFim?: string
	ProfissionalExecutanteId?: string
	ProfissionalExecutanteDescricao?: string
	ProfissionalExecutanteCrm?: string
	ProfissionalSolicitanteId?: string
	ProfissionalSolicitanteDescricao?: string
	profissionalSolicitanteCrm?: string
	QuantidadeMarcacoesDia?: number
	SmkMedCod?: string
	ProfissionalNome?: string
	SmkLocCod?: string
	LocalDescricao?: string
	Situacao?: string
	ObsAgendamento?: string
}

export interface SmartAppointmentListResponse {
	Agendamentos: SmartAppointment[]
}

export interface CreateAppointmentRequest {
	ConvenioId: string
	PlanoId?: string
	MatriculaId?: string
	DtmarcacaoIni: string
	DtmarcacaoFim: string
	PacCep?: string
	UnidadeId: string
	ProcedimentoId: string
	ProfissionalExecutanteId: string
	ProfissionalSolicitanteId?: string
	Observacao?: string
	EnderecoColetaDomiciliar?: string
	PacienteId: number
}

export interface CancelAppointmentRequest {
	PacienteId?: string
	ProcedimentoId?: string
	ProfissionalExecutanteId?: string
	DataHora?: string
}

@Injectable()
export class SmartApiService {
	private readonly axiosInstance: AxiosInstance

	constructor(private configService: ConfigService) {
		const baseURL = this.configService.get<string>('SMART_API_BASE_URL')
		const token = this.configService.get<string>('SMART_API_TOKEN')

		this.axiosInstance = axios.create({
			baseURL,
			headers: {
				'Content-Type': 'application/json',
				'X-AUTH-TOKEN': token,
			},
		})
	}

	async getAppointments(
		startDate: string,
		endDate: string,
		pacienteId?: number,
	): Promise<SmartAppointmentListResponse> {
		const url = `/api/agenda/${startDate}/${endDate}`
		const params = pacienteId ? { PacienteId: pacienteId } : {}

		const response = await this.axiosInstance.get<
			SmartAppointment[] | SmartAppointmentListResponse
		>(url, {
			params,
		})

		const appointments = Array.isArray(response.data)
			? response.data
			: response.data.Agendamentos || []

		return { Agendamentos: appointments }
	}

	async createAppointment(data: CreateAppointmentRequest): Promise<string> {
		const response = await this.axiosInstance.post<string>(
			'/api/agenda/confirmar',
			data,
		)
		return response.data
	}

	async cancelAppointment(data: CancelAppointmentRequest): Promise<string> {
		const response = await this.axiosInstance.post<string>(
			'/api/agenda/cancelar',
			data,
		)
		return response.data
	}

	async confirmAppointment(
		agendaId: string,
		observacao: string,
	): Promise<boolean> {
		const response = await this.axiosInstance.get<boolean>(
			`/api/agenda/confirmarPaciente/${agendaId}/${observacao}`,
		)
		return response.data
	}
}
