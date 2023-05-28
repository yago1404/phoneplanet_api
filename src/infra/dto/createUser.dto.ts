import { AddressDto } from './address.dto';

export class CreateUserDto {
  id: number;
  name: string;
  password: string;
  email: string;
  photo: string;
  address: AddressDto;
  birthday: Date;
}
