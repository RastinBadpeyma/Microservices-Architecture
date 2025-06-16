import { Inject, Module } from '@nestjs/common'
import { ReservationsService } from './reservations.service'
import { ReservationsController } from './reservations.controller'
import { AUTH_SERVICE, DatabaseModule, LoggerModule } from '@app/common'
import { ReservationsRepository } from './reservations.repository'
import {
  ReservationDocument,
  ReservationSchema,
} from './models/reservation.schema'
import { ConfigModule, ConfigService } from '@nestjs/config'
import * as Joi from 'joi'
import { ClientsModule, Transport } from '@nestjs/microservices'

@Module({
  imports: [
    DatabaseModule,
     // MongooseModule.forFeature([{ name: ReservationDocument.name , schema: ReservationSchema }]),
    DatabaseModule.forFeature([
      { name: ReservationDocument.name, schema: ReservationSchema },
    ]),
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        PORT: Joi.number().required(),
      }),
    }),
     ClientsModule.registerAsync([
      {
        name: AUTH_SERVICE,
        useFactory:(confgiService:ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: confgiService.get('AUTH_HOST'),
            port:confgiService.get('AUTH_PORT'),
          },
        }),
        inject:[ConfigService]
      }
     ])
   
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService, ReservationsRepository],
})
export class ReservationsModule {}
