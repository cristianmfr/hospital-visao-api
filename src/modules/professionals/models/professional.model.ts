import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('dad_medico')
export class Professional {
	@PrimaryGeneratedColumn()
	mdcId: number

	@Column({ type: 'varchar', length: 255 })
	mdcNome: string

	@Column({ type: 'varchar', length: 12, nullable: true })
	mdcCPF: string

	@Column({ type: 'varchar', length: 20, nullable: true })
	mdcRG: string

	@Column({ type: 'varchar', length: 10, nullable: true })
	mdcNascimento: string

	@Column({ type: 'varchar', length: 10, nullable: true })
	mdcSexo: string

	@Column({ type: 'varchar', length: 255, nullable: true })
	mdcEndereco: string

	@Column({ type: 'varchar', length: 255, nullable: true })
	mdcComplemento: string

	@Column({ type: 'decimal', precision: 20, scale: 0, nullable: true })
	mdcNumero: number

	@Column({ type: 'varchar', length: 255, nullable: true })
	mdcBairro: string

	@Column({ type: 'varchar', length: 9, nullable: true })
	mdcCEP: string

	@Column({ type: 'int', nullable: true })
	mdcCidade: number

	@Column({ type: 'int', nullable: true })
	mdcEstado: number

	@Column({ type: 'varchar', length: 15, nullable: true })
	mdcTelefone: string

	@Column({ type: 'varchar', length: 15, nullable: true })
	mdcCelular: string

	@Column({ type: 'varchar', length: 255, nullable: true })
	mdcEmail: string

	@Column({ type: 'varchar', length: 20, nullable: true })
	mdcCRM: string

	@Column({ type: 'varchar', length: 4, nullable: true })
	mdcCRMEstado: string

	@Column({ type: 'text', nullable: true })
	mdcObservacao: string

	@Column({ type: 'varchar', length: 10, default: 'INATIVO' })
	mdcSituacao: string

	@Column({ type: 'datetime', nullable: true })
	mdcAlteracaoData: Date

	@Column({ type: 'int', nullable: true })
	mdcAlteracaoUsuario: number

	@Column({ type: 'varchar', length: 20, nullable: true })
	mdcPixeOn: string
}
