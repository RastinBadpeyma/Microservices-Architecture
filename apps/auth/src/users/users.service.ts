import { Body, Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
    constructor(
        private readonly userRepo: UserRepository,
    ){}

    async createUser(createUserDto: CreateUserDto) {
      return this.userRepo.create(createUserDto);
    }
}
