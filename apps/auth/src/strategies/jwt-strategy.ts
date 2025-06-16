import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { UsersService } from '../users/users.service'
import { ConfigService } from '@nestjs/config'
import { TokenPayload } from '../interfaces/payload.interface'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
  ) {
    const secret = configService.get<string>('JWT_SECRET')
    
    if (!secret) {
      throw new Error('JWT_ACCESS_SECRET is not defined in environment variables.')
    }

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any) =>  
          request?.cookies?.Authentication ||
          // when the jwt is coming in from our RPC call in our jwt Auth guard, 
          // it is not going to be inside of the cookies object, it is going to be under th straight request object
          request?.Authentication || 
          request?.headers.Authentication,
      ]),
      secretOrKey: secret,
    })
  }

  validate(payload: TokenPayload) { 
    return this.userService.getUser({_id: payload.sub})
  }
}