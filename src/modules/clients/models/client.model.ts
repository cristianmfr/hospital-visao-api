import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('dad_paciente')
export class Client {
	@PrimaryGeneratedColumn()
	pctId: number

	@Column({ type: 'varchar', length: 255 })
	pctNome: string

	@Column({ type: 'varchar', length: 12, nullable: true })
	pctCPF: string

	@Column({ type: 'varchar', length: 20, nullable: true })
	pctRG: string

	@Column({ type: 'varchar', length: 10, nullable: true })
	pctNascimento: string

	@Column({ type: 'varchar', length: 10, nullable: true })
	pctSexo: string

	@Column({ type: 'varchar', length: 255, nullable: true })
	pctEndereco: string

	@Column({ type: 'varchar', length: 255, nullable: true })
	pctComplemento: string

	@Column({ type: 'decimal', precision: 20, scale: 0, nullable: true })
	pctNumero: number

	@Column({ type: 'varchar', length: 255, nullable: true })
	pctBairro: string

	@Column({ type: 'varchar', length: 9, nullable: true })
	pctCEP: string

	@Column({ type: 'int', nullable: true })
	pctCidade: number

	@Column({ type: 'int', nullable: true })
	pctEstado: number

	@Column({ type: 'varchar', length: 15, nullable: true })
	pctTelefone: string

	@Column({ type: 'varchar', length: 15, nullable: true })
	pctCelular: string

	@Column({ type: 'varchar', length: 255, nullable: true })
	pctEmail: string

	@Column({ type: 'varchar', length: 255, nullable: true })
	pctNomeMae: string

	@Column({ type: 'varchar', length: 255, nullable: true })
	pctNomePai: string

	@Column({ type: 'varchar', length: 255, nullable: true })
	pctProfissao: string

	@Column({ type: 'varchar', length: 18, nullable: true })
	pctIndicacao: string

	@Column({ type: 'varchar', length: 14, nullable: true })
	pctEstadoCivil: string

	@Column({ type: 'varchar', length: 12, nullable: true })
	pctCPFResponsavel: string

	@Column({ type: 'varchar', length: 10, default: 'INATIVO' })
	pctSituacao: string

	@Column({ type: 'datetime', nullable: true })
	pctAlteracaoData: Date

	@Column({ type: 'int', nullable: true })
	pctAlteracaoUsuario: number

	@Column({ type: 'varchar', length: 20, nullable: true })
	pctPixeOn: string
}
