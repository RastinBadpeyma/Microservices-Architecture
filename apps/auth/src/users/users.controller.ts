import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { CurrentUser } from '../../../../libs/common/src/decorators/current-user.decorator'
import { UsersDocument } from './models/user.schema'
import { JwtAuthGuard } from '../guards/jwt-auth.guard'

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto)
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUser(
   @CurrentUser() user:UsersDocument
  ){
    return user;
  }
}
