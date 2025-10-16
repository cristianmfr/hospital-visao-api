import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { getDatabaseConfig } from './config/database.config'
import { AppointmentsModule } from './modules/appointments/appointments.module'
import { ClientsModule } from './modules/clients/clients.module'
import { HealthInsurancesModule } from './modules/health-insurances/health-insurances.module'
import { LocationsModule } from './modules/locations/locations.module'
import { PlansModule } from './modules/plans/plans.module'
import { ProfessionalsModule } from './modules/professionals/professionals.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: getDatabaseConfig,
			inject: [ConfigService],
		}),
		AppointmentsModule,
		ClientsModule,
		HealthInsurancesModule,
		LocationsModule,
		PlansModule,
		ProfessionalsModule,
	],
})
export class AppModule {}
