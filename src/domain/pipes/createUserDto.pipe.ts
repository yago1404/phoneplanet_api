import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { LoginDto } from '../../infra/dto/login.dto';
import { CreateUserDto } from '../../infra/dto/createUser.dto';

@Injectable()
export class CreateUserDtoPipe implements PipeTransform<any, CreateUserDto> {
  transform(value: any): CreateUserDto {
    const { id, name, password, cpf, email, photo, address, birthday } = value;
    if (!email || !password || !cpf) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'É preciso enviar Email, Senha e CPF',
      });
    }
    const createUserDto: CreateUserDto = new CreateUserDto();
    createUserDto.id = id;
    createUserDto.name = name;
    createUserDto.password = password;
    createUserDto.cpf = cpf;
    createUserDto.email = email;
    createUserDto.photo = photo;
    createUserDto.address = address;
    createUserDto.birthday = birthday;
    return createUserDto;
  }
}
