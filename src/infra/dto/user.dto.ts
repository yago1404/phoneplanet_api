import { AddressDto } from './address.dto';

export class UserDto {
  id: number;
  name: string;
  cpf: string;
  email: string;
  photo: string;
  address: AddressDto;
  birthday: Date;
}
