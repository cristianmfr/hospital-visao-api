import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('dad_convenio')
export class HealthInsurance {
	@PrimaryGeneratedColumn()
	cvnId: number

	@Column({ type: 'varchar', length: 255 })
	cvnNome: string

	@Column({ type: 'varchar', length: 20, nullable: true })
	cvnCredencial: string

	@Column({ type: 'varchar', length: 4, nullable: true })
	cvnPagamentoOnline: string

	@Column({ type: 'varchar', length: 10, default: 'INATIVO' })
	cvnSituacao: string

	@Column({ type: 'datetime', nullable: true })
	cvnAlteracaoData: Date

	@Column({ type: 'int', nullable: true })
	cvnAlteracaoUsuario: number

	@Column({ type: 'varchar', length: 20, nullable: true })
	cvnPixeOn: string
}
