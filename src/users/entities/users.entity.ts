import { Column, Entity, Unique } from 'typeorm';
import { BaseEntity } from '../../database/base.entity';

@Entity()
@Unique('uq_users_email_name', ['email', 'username'])
export class UsersEntity extends BaseEntity {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  age: number;

  @Column()
  email: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  role: string;
}
