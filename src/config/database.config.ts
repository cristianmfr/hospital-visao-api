import { ConfigService } from '@nestjs/config'
import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { Appointment } from 'src/modules/appointments/models/appointment.model'
import { Client } from 'src/modules/clients/models/client.model'
import { HealthInsurance } from 'src/modules/health-insurances/models/health-insurance.model'
import { Professional } from 'src/modules/professionals/models/professional.model'
import { Specialty } from 'src/modules/professionals/models/specialty.model'

export const getDatabaseConfig = (
	configService: ConfigService,
): TypeOrmModuleOptions => ({
	type: 'mysql',
	host: configService.get('DB_HOST'),
	port: 3306,
	username: configService.get('DB_USERNAME'),
	password: configService.get('DB_PASSWORD'),
	database: configService.get('DB_DATABASE'),
	entities: [Appointment, Client, HealthInsurance, Professional, Specialty],
	synchronize: false,
	logging: configService.get('NODE_ENV') === 'development',
	charset: 'utf8mb4',
	timezone: 'Z',
	extra: {
		connectionLimit: 10,
		waitForConnections: true,
		queueLimit: 0,
		connectTimeout: 60000,
		acquireTimeout: 60000,
		timeout: 60000,
		enableKeepAlive: true,
		keepAliveInitialDelay: 0,
	},
	maxQueryExecutionTime: 10000,
	retryAttempts: 3,
	retryDelay: 3000,
})
