import { IsEmail, IsOptional, IsString, Matches } from 'class-validator'

export class UpdateClientDto {
	@IsOptional()
	@IsString()
	name?: string

	@IsOptional()
	@IsEmail()
	email?: string

	@IsOptional()
	@IsString()
	@Matches(/^\d{11}$/, {
		message: 'cpf must be 11 digits without formatting',
	})
	cpf?: string

	@IsOptional()
	@IsString()
	@Matches(/^\d{4}-\d{2}-\d{2}$/, {
		message: 'birthday must be in format YYYY-MM-DD',
	})
	birthday?: string
}
