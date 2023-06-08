import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { LoginDto } from '../../infra/dto/login.dto';

@Injectable()
export class ParseLoginDtoPipe implements PipeTransform<any, LoginDto> {
  transform(value: any): LoginDto {
    const { email, password } = value;
    if (!email || !password) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'É preciso enviar Email e senha',
      });
    }
    return new LoginDto(email, password);
  }
}
