import { AddressDto } from './address.dto';

export class UserDto {
  id: number;
  name: string;
  email: string;
  photo: string;
  address: AddressDto;
  birthday: Date;
}
