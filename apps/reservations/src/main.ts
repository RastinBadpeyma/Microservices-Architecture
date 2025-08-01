import { NestFactory } from '@nestjs/core'
import { ReservationsModule } from './reservations.module'
import { ValidationPipe } from '@nestjs/common'
import { Logger } from 'nestjs-pino'
import { ConfigService } from '@nestjs/config'
import * as cookieParser from 'cookie-parser'

async function bootstrap() {
  const app = await NestFactory.create(ReservationsModule)
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true })) //remove extra properties
  app.useLogger(app.get(Logger))
  const configService = app.get(ConfigService)
  const port = configService.get('PORT')
  await app.listen(port)
}
bootstrap()
