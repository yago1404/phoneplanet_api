import {
  Body,
  Controller,
  Get,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { UserDto } from '../infra/dto/user.dto';
import { LoginDto } from '../infra/dto/login.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private service: UsersService) {}

  @Get('/check-auth')
  async checkAuth(): Promise<object> {
    return { statusCode: 200, result: 'authenticated' };
  }

  @Post('/create')
  async createUser(@Body() newUser: UserDto): Promise<UserDto> {
    return await this.service.createUser(newUser);
  }

  @Post('/login')
  async authenticate(@Body() login: LoginDto): Promise<UserDto> {
    if (login.password !== 'password') {
      throw new UnauthorizedException('Invalid username or password');
    }
    return new UserDto();
  }
}
