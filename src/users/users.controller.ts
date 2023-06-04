import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { UserDto } from '../infra/dto/user.dto';
import { UsersService } from './users.service';
import { CreateUserDto } from '../infra/dto/createUser.dto';

@Controller('users')
export class UsersController {
  constructor(private service: UsersService) {}

  @Get('/check-availability')
  async checkEmail(
    @Query('email') email: string,
    @Query('cpf') cpf: string,
    @Res() res,
  ): Promise<Response> {
    const canUseEmail: boolean = email
      ? await this.service.checkEmail(email)
      : true;
    const canUseCpf: boolean = cpf ? await this.service.checkCpf(cpf) : true;
    if (canUseEmail && canUseCpf) {
      return res.status(200).json({ statusCode: 200, result: {} });
    }
    return res.status(409).json({
      statusCode: 409,
      message: 'O E-mail ou CPF já esta sendo usado por outro usuário',
    });
  }

  @Post('/create')
  async createUser(
    @Body() newUser: CreateUserDto,
    @Res() res,
  ): Promise<UserDto | object> {
    try {
      const canUseEmail: boolean = await this.service.checkEmail(newUser.email);
      const canUseCpf: boolean = await this.service.checkCpf(newUser.cpf);
      if (!(canUseEmail && canUseCpf)) {
        return res.status(409).json({
          statusCode: 409,
          message: 'O E-mail ou CPF já esta sendo usado por outro usuário',
        });
      }
      const user: UserDto = await this.service.createUser(newUser);
      return res.status(200).json({ statusCode: 200, result: user });
    } catch (e) {
      if (e == BadRequestException) {
        return res
          .status(400)
          .json({ statusCode: 400, message: 'Bad Request' });
      } else if (e.routine == 'DateTimeParseError') {
        return res.status(400).json({
          statusCode: 400,
          message: 'Verifique se o campo de data foi enviado como YYYY-MM-DD',
        });
      }
      return res
        .status(500)
        .json({ statusCode: 500, message: 'Internal Server Error' });
    }
  }
}
