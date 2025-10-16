import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Client } from '../clients/models/client.model'
import { LocationsController } from './locations.controller'
import { LocationsService } from './locations.service'

@Module({
	imports: [TypeOrmModule.forFeature([Client])],
	controllers: [LocationsController],
	providers: [LocationsService],
})
export class LocationsModule {}
