import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ClientsController } from './clients.controller'
import { ClientsService } from './clients.service'
import { Client } from './models/client.model'

@Module({
	imports: [TypeOrmModule.forFeature([Client])],
	controllers: [ClientsController],
	providers: [ClientsService],
})
export class ClientsModule {}
