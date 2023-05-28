import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../infra/entities/user.entity';
import { UserDto } from '../infra/dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repository: Repository<User>) {}

  async createUser(userDto: UserDto): Promise<UserDto> {
    const newUser: User = this.repository.create(userDto);

    console.log(newUser);

    await this.repository.save(newUser);
    return newUser;
  }
}
