import { NestFactory } from '@nestjs/core'
import { AuthModule } from './auth.module'
import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Logger } from 'nestjs-pino'
import * as cookieParser from 'cookie-parser'
import { Transport } from '@nestjs/microservices'

async function bootstrap() {
  const app = await NestFactory.create(AuthModule)
  const configService = app.get(ConfigService)
  // connect a microservice 
  app.connectMicroservice({
    transport: Transport.TCP,  
    options: {
      host: '0.0.0.0',
      port: configService.get('TCP_PORT')
    }
  })
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }))
  app.useLogger(app.get(Logger))
  
  
  // start all microservices up over the TCP transport layer and listen for incomming events and request
  await app.startAllMicroservices();
  const port = configService.get('HTTP_PORT');
  await app.listen(port)
}
bootstrap()
