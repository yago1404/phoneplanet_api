import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { UserDto } from '../infra/dto/user.dto';
import { LoginDto } from '../infra/dto/login.dto';
import { UsersService } from './users.service';
import { CreateUserDto } from '../infra/dto/createUser.dto';

@Controller('users')
export class UsersController {
  constructor(private service: UsersService) {}

  @Get('/check-auth')
  async checkAuth(): Promise<object> {
    return { statusCode: 200, result: 'authenticated' };
  }

  @Post('/create')
  async createUser(
    @Body() newUser: CreateUserDto,
    res: Response,
  ): Promise<UserDto | object> {
    try {
      return await this.service.createUser(newUser);
    } catch (e) {
      if (e == BadRequestException) {
        return res.status(400).json({ status: 400, message: 'Bad Request' });
      }
      return res
        .status(500)
        .json({ status: 500, message: 'Internal Server Error' });
    }
  }

  @Post('/login')
  async authenticate(@Body() login: LoginDto): Promise<UserDto> {
    if (login.password !== 'password') {
      throw new UnauthorizedException('Invalid username or password');
    }
    return new UserDto();
  }
}
