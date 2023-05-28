import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../infra/entities/user.entity';
import { UserDto } from '../infra/dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../infra/dto/createUser.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repository: Repository<User>) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserDto> {
    const newUser: User = this.repository.create(createUserDto);
    await this.repository.save(newUser);
    delete newUser.password;
    return newUser;
  }
}
