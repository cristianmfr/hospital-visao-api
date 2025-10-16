import { ConfigService } from '@nestjs/config'
import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { Appointment } from 'src/modules/appointments/models/appointment.model'

export const getDatabaseConfig = (
	configService: ConfigService,
): TypeOrmModuleOptions => ({
	type: 'mysql',
	host: configService.get('DB_HOST'),
	port: 3306,
	username: configService.get('DB_USERNAME'),
	password: configService.get('DB_PASSWORD'),
	database: configService.get('DB_DATABASE'),
	entities: [Appointment],
	synchronize: false,
	logging: configService.get('NODE_ENV') === 'development',
	charset: 'utf8mb4',
	timezone: 'Z',
	extra: {
		connectionLimit: 10,
	},
})
