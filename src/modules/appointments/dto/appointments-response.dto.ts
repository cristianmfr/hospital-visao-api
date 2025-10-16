export class ClientDto {
	id: string
	name: string
	phone: string
}

export class LocationDto {
	id: string
	address: string
}

export class ProfessionalDto {
	id: string
	name: string
}

export class ServiceDto {
	id: string
	name: string
}

export class AppointmentResponseDto {
	id: string
	date: string
	hour: string
	endHour: string
	state: string
	classification: string
	client: ClientDto
	location: LocationDto
	professional: ProfessionalDto
	service: ServiceDto
}
