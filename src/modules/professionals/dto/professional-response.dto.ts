import { SpecialtyDto } from './specialty.dto'

export class ProfessionalResponseDto {
	id: string
	name: string
	description?: string
	image?: string
	expertise?: string
	register?: string
	specialties?: SpecialtyDto[]
}
