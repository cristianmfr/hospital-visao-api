import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import axios, { AxiosError, AxiosInstance } from 'axios'

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
	private readonly logger = new Logger(SmartApiService.name)
	private readonly axiosInstance: AxiosInstance
	private currentToken: string | null = null
	private tokenRefreshPromise: Promise<string> | null = null

	constructor(private configService: ConfigService) {
		const baseURL = this.configService.get<string>('SMART_API_BASE_URL')

		this.axiosInstance = axios.create({
			baseURL,
			headers: {
				'Content-Type': 'application/json',
			},
		})

		this.setupInterceptors()
	}

	private setupInterceptors() {
		this.axiosInstance.interceptors.request.use(
			async (config) => {
				if (!this.currentToken) {
					await this.login()
				}
				config.headers['X-AUTH-TOKEN'] = this.currentToken
				return config
			},
			(error) => Promise.reject(error),
		)

		this.axiosInstance.interceptors.response.use(
			(response) => response,
			async (error: AxiosError) => {
				const originalRequest = error.config as any

				if (error.response?.status === 401 && !originalRequest._retry) {
					originalRequest._retry = true

					try {
						this.logger.warn('Token expired, refreshing...')
						await this.login()
						originalRequest.headers['X-AUTH-TOKEN'] = this.currentToken
						return this.axiosInstance(originalRequest)
					} catch (refreshError) {
						this.logger.error('Failed to refresh token', refreshError)
						return Promise.reject(refreshError)
					}
				}

				return Promise.reject(error)
			},
		)
	}

	private async login(): Promise<string> {
		if (this.tokenRefreshPromise) {
			return this.tokenRefreshPromise
		}

		this.tokenRefreshPromise = (async () => {
			try {
				const username = this.configService.get<string>('SMART_API_USERNAME')
				const password = this.configService.get<string>('SMART_API_PASSWORD')
				const app =
					this.configService.get<string>('SMART_API_APP') || 'HospitalVisaoAPI'

				this.logger.log('Authenticating with Smart API...')

				const response = await axios.post<string>(
					`${this.configService.get<string>('SMART_API_BASE_URL')}/api/Sessao`,
					{
						Login: username,
						Senha: password,
						App: app,
					},
					{
						headers: {
							'Content-Type': 'application/json',
						},
					},
				)

				this.currentToken = response.data
				this.logger.log('Successfully authenticated with Smart API')

				return this.currentToken
			} catch (error) {
				this.logger.error('Failed to authenticate with Smart API', error)
				throw error
			} finally {
				this.tokenRefreshPromise = null
			}
		})()

		return this.tokenRefreshPromise
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
