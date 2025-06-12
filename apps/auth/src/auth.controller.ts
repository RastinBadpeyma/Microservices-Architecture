import { Controller, Get, Post, Res, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LocalAuthGuard } from './guards/local-auth.guard'
import { CurrentUser } from './decorator/current-user.decorator'
import { UsersDocument } from './users/models/user.schema'

import { Response } from 'express'

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
}
