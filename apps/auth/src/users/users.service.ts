import { Body, Injectable, UnauthorizedException } from '@nestjs/common'
import { UserRepository } from './user.repository'
import { CreateUserDto } from './dto/create-user.dto'
import * as bcrypt from 'bcryptjs'
import { GetUserDto } from './dto/get-user.dto'

@Injectable()
export class UsersService {
  constructor(private readonly userRepo: UserRepository) {}

  async createUser(createUserDto: CreateUserDto) {
    const user = this.userRepo.create({
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password , 10),
    })
    return user;
  }

  async VerifyUser(email, password) {
    const user = await this.userRepo.findOne({})
    const passCheck = await bcrypt.compare(password, user.password)
    if (!user && !passCheck) {
      throw new UnauthorizedException('user doesnt exist')
    }
    return user
  }

  async getUser(getUserDto: GetUserDto){
    return this.userRepo.find(getUserDto);
  }
}
