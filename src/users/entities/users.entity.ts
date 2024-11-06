import { Column, Entity, OneToMany, Unique } from 'typeorm';

import { BaseEntity } from '../../database/base.entity';
import { ROLES } from '../../constants';
import { UsersProjectsEntity } from './users-projects.entity';

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

  @Column({ type: 'enum', enum: ROLES })
  role: ROLES;

  @OneToMany(
    () => UsersProjectsEntity,
    (usersProjects) => usersProjects.user,
  )
  public projectsIncludes: UsersProjectsEntity[];
}
