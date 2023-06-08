import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common';
import { Response } from 'express';
import { UserDto } from '../infra/dto/user.dto';
import { UsersService } from './users.service';
import { CreateUserDto } from '../infra/dto/createUser.dto';
import { LoginDto } from '../infra/dto/login.dto';
import { ParseLoginDtoPipe } from '../domain/pipes/parseLoginDto.pipe';
import { User } from '../infra/entities/user.entity';
import { rethrow } from '@nestjs/core/helpers/rethrow';
import { CreateUserDtoPipe } from '../domain/pipes/createUserDto.pipe';
import { AuthUtil } from '../domain/utils/auth.util';

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
  @UsePipes(CreateUserDtoPipe)
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
      const jwt = await AuthUtil.generateJwt(user.name, user.id);
      const refreshToken: string = await AuthUtil.generateRefreshToken();
      await this.service.registerRefreshToken(user.id, refreshToken);
      return res
        .status(200)
        .json({ statusCode: 200, result: { jwt, refreshToken, user } });
    } catch (e) {
      if (e.routine == 'DateTimeParseError') {
        return res.status(400).json({
          statusCode: 400,
          message: 'Verifique se o campo de data foi enviado como YYYY-MM-DD',
        });
      }
      rethrow(e);
    }
  }

  @Post('/login')
  @UsePipes(ParseLoginDtoPipe)
  async doLogin(
    @Body() loginDto: LoginDto,
    @Res() res: Response,
  ): Promise<Response> {
    const user: User = await this.service.doLogin(loginDto);
    if (user == null) {
      throw new UnauthorizedException({
        statusCode: 401,
        message: 'Login ou senha incorretos',
      });
    }
    const jwt = await AuthUtil.generateJwt(user.name, user.id);
    const refreshToken: string = await AuthUtil.generateRefreshToken();
    await this.service.registerRefreshToken(user.id, refreshToken);
    return res
      .status(200)
      .json({ statusCode: 200, result: { jwt, refreshToken } });
  }
}
