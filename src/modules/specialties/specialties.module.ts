import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Specialty } from '../professionals/models/specialty.model'
import { SpecialtiesController } from './specialties.controller'
import { SpecialtiesService } from './specialties.service'

@Module({
	imports: [TypeOrmModule.forFeature([Specialty])],
	controllers: [SpecialtiesController],
	providers: [SpecialtiesService],
})
export class SpecialtiesModule {}
