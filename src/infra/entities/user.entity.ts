import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Address } from './address.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column()
  cpf: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  photo: string;

  @Column()
  birthday: Date;

  @OneToOne(() => Address, { cascade: true, nullable: true })
  @JoinColumn()
  address: Address;
}
