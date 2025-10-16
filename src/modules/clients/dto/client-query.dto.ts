import { Type } from 'class-transformer'
import { IsInt, IsOptional, IsString, Min } from 'class-validator'

export class ClientQueryDto {
	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(1)
	limit?: number

	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(0)
	offset?: number
}

export class ClientSearchDto extends ClientQueryDto {
	@IsString()
	term: string
}
