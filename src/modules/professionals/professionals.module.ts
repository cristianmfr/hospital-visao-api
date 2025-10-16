import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Professional } from './models/professional.model'
import { Specialty } from './models/specialty.model'
import { ProfessionalsController } from './professionals.controller'
import { ProfessionalsService } from './professionals.service'

@Module({
	imports: [TypeOrmModule.forFeature([Professional, Specialty])],
	controllers: [ProfessionalsController],
	providers: [ProfessionalsService],
})
export class ProfessionalsModule {}
