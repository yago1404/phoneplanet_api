import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../infra/entities/user.entity';
import { UserDto } from '../infra/dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../infra/dto/createUser.dto';
import { LoginDto } from '../infra/dto/login.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repository: Repository<User>) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserDto> {
    const newUser: User = this.repository.create(createUserDto);
    await this.repository.save(newUser);
    delete newUser.password;
    return newUser;
  }

  async checkEmail(email: string): Promise<boolean> {
    const users: User[] = await this.repository.findBy({ email: email });
    return users.length === 0;
  }

  async checkCpf(cpf: string): Promise<boolean> {
    const users: User[] = await this.repository.findBy({ cpf: cpf });
    return users.length === 0;
  }

  async doLogin(loginDto: LoginDto): Promise<User> {
    const user: User = await this.repository.findOneBy({
      email: loginDto.email,
      password: loginDto.password,
    });
    if (user !== null) delete user.password;
    return user;
  }

  async registerRefreshToken(id: number, refreshToken: string): Promise<void> {
    await this.repository.update({ id }, { refreshToken });
  }
}
