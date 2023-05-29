import { AddressDto } from './address.dto';

export class CreateUserDto {
  id: number;
  name: string;
  password: string;
  cpf: string;
  email: string;
  photo: string;
  address: AddressDto;
  birthday: Date;
}
