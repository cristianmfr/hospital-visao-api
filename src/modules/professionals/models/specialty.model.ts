import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('dad_especialidade')
export class Specialty {
	@PrimaryGeneratedColumn()
	spcId: number

	@Column({ type: 'varchar', length: 255 })
	spcNome: string

	@Column({ type: 'varchar', length: 10, default: 'INATIVA' })
	spcSituacao: string

	@Column({ type: 'datetime', nullable: true })
	spcAlteracaoData: Date

	@Column({ type: 'int', nullable: true })
	spcAlteracaoUsuario: number

	@Column({ type: 'varchar', length: 20, nullable: true })
	spcPixeOn: string
}
