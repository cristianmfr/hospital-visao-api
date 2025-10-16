import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppointmentsController } from './appointments.controller'
import { AppointmentsService } from './appointments.service'
import { Appointment } from './models/appointment.model'

@Module({
	imports: [TypeOrmModule.forFeature([Appointment])],
	controllers: [AppointmentsController],
	providers: [AppointmentsService],
})
export class AppointmentsModule {}
