import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { HealthInsurancesController } from './health-insurances.controller'
import { HealthInsurancesService } from './health-insurances.service'
import { HealthInsurance } from './models/health-insurance.model'

@Module({
	imports: [TypeOrmModule.forFeature([HealthInsurance])],
	controllers: [HealthInsurancesController],
	providers: [HealthInsurancesService],
})
export class HealthInsurancesModule {}
