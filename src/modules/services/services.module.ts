import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Specialty } from '../professionals/models/specialty.model'
import { ServicesController } from './services.controller'
import { ServicesService } from './services.service'

@Module({
	imports: [TypeOrmModule.forFeature([Specialty])],
	controllers: [ServicesController],
	providers: [ServicesService],
})
export class ServicesModule {}
