import { Controller, Get, Post, Res, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LocalAuthGuard } from './guards/local-auth.guard'

import { UsersDocument } from './users/models/user.schema'

import { Response } from 'express'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { CurrentUser } from '@app/common'

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @CurrentUser() user: UsersDocument,
    @Res({ passthrough: true }) response: Response,
  ) {
    const jwt = this.authService.login(user, response);
    response.send(jwt);
  }

  @UseGuards(JwtAuthGuard)
  //@messagePattern: it allows us to accept incoming RPC calls on our chosen transport layer
  // what @payload does?
  //when we put the user in @currentUser() after this?
  @MessagePattern('authenticate')
  async authenticate(@Payload() data: any) {
    return data.user;
  }

}
