import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Appointment } from '../appointments/models/appointment.model'
import { Professional } from '../professionals/models/professional.model'
import { ScheduleController } from './schedule.controller'
import { ScheduleService } from './schedule.service'

@Module({
	imports: [TypeOrmModule.forFeature([Professional, Appointment])],
	controllers: [ScheduleController],
	providers: [ScheduleService],
})
export class ScheduleModule {}
