import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { HealthInsurance } from '../health-insurances/models/health-insurance.model'
import { PlansController } from './plans.controller'
import { PlansService } from './plans.service'

@Module({
	imports: [TypeOrmModule.forFeature([HealthInsurance])],
	controllers: [PlansController],
	providers: [PlansService],
})
export class PlansModule {}
