import { Injectable } from '@nestjs/common'
import { UsersDocument } from './users/models/user.schema'
import { JwtService } from '@nestjs/jwt'
import { TokenPayload } from './interfaces/payload.interface'
import { Response } from 'express'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async login(user: UsersDocument, response: Response) {
    const tokenPayload: TokenPayload = {
      sub: user._id.toHexString(),
      email: user.email,
    }
    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() + this.configService.get('JWT_EXPIRATION')
    ) 
    const token = this.jwtService.sign(tokenPayload)
    response.cookie('Authentication', token, {
      httpOnly: true,
      expires,
    })
    return token;
  }
}
