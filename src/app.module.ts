import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { getDatabaseConfig } from './config/database.config'
import { AppointmentsModule } from './modules/appointments/appointments.module'

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
	],
})
export class AppModule {}
