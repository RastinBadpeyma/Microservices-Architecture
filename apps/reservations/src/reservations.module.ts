import { Inject, Module } from '@nestjs/common'
import { ReservationsService } from './reservations.service'
import { ReservationsController } from './reservations.controller'
import { AUTH_SERVICE, DatabaseModule, LoggerModule, PAYMENT_SERVICE } from '@app/common'
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
        AUTH_HOST: Joi.string().required(),
        PAYMENTS_HOST: Joi.string().required(),
        AUTH_PORT: Joi.number().required(),
        PAYMENTS_PORT: Joi.number().required(),
      
      }),
    }),
     ClientsModule.registerAsync([
      {
 
      /* we use AUTH_SERVICE in libs/common/auth/jwt-auth.guard and nest understand that it should store the TCP client registered with 
          the AUTH_SERVICE token into the client
      */
        name: AUTH_SERVICE,
        useFactory:(confgiService:ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: confgiService.get('AUTH_HOST'),
            port:confgiService.get('AUTH_PORT'),
          },
        }),
        inject:[ConfigService],
      },
      {
        name: PAYMENT_SERVICE,
        useFactory:(confgService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: confgService.get('PAYMENTS_HOST'),
            port: confgService.get('PAYMENTS_PORT'),
          }
        }),
        inject:[ConfigService],
      }

     ])
   
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService, ReservationsRepository],
})
export class ReservationsModule {}
