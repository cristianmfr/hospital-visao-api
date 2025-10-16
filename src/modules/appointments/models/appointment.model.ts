import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('dad_atendimento')
export class Appointment {
	@PrimaryGeneratedColumn()
	tdmId: number

	@Column({ type: 'date' })
	tdmData: Date

	@Column({ type: 'time' })
	tdmHora: string

	@Column()
	tdmMedico: number

	@Column()
	tdmPaciente: number

	@Column({ type: 'decimal', precision: 20, scale: 2 })
	tdmValor: number

	@Column({ length: 12 })
	tdmPagamentoTipo: string

	@Column({ length: 18 })
	tdmPagamentoForma: string

	@Column({ length: 10 })
	tdmPagamentoSituacao: string

	@Column({ type: 'text' })
	tdmObservacao: string

	@Column({ length: 4 })
	tdmConfirmado: string

	@Column({ length: 4 })
	tdmRetorno: string

	@Column()
	tdmConvenio: number

	@Column()
	tdmCirurgia: number

	@Column()
	tdmExame: number

	@Column()
	tdmEspecialidade: number

	@Column({ length: 10 })
	tdmServico: string

	@Column({ length: 14 })
	tdmSituacao: string

	@Column({ type: 'datetime' })
	tdmAlteracaoData: Date

	@Column()
	tdmAlteracaoUsuario: number

	@Column({ length: 20 })
	tdmPixeOn: string
}
