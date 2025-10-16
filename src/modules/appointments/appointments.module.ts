import { Module } from '@nestjs/common'
import { AppointmentsController } from './appointments.controller'
import { AppointmentsService } from './appointments.service'
import { SmartApiService } from './smart-api.service'

@Module({
	controllers: [AppointmentsController],
	providers: [AppointmentsService, SmartApiService],
})
export class AppointmentsModule {}
