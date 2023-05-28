import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cep: string;

  @Column()
  street: string;

  @Column()
  neighborhood: string;

  @Column({ nullable: true })
  complement: string;

  @Column()
  state: string;

  @Column()
  city: string;

  @Column({ nullable: true })
  number: number;

  @OneToOne(() => User, (user) => user.address)
  user: User;
}
