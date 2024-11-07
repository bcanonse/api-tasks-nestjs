import { Column, Entity, OneToMany, Unique } from 'typeorm';

import { AutoMap } from '@automapper/classes';

import { BaseEntity } from '../../database/base.entity';
import { ROLES } from '../../constants';
import { UsersProjectsEntity } from './users-projects.entity';
import { Exclude } from 'class-transformer';

@Entity()
@Unique('uq_users_email_name', ['email', 'username'])
export class UsersEntity extends BaseEntity {
  @AutoMap()
  @Column()
  firstName: string;

  @AutoMap()
  @Column()
  lastName: string;

  @AutoMap()
  @Column()
  age: number;

  @AutoMap()
  @Column()
  email: string;

  @AutoMap()
  @Column()
  username: string;

  @AutoMap()
  @Column()
  @Exclude()
  password: string;

  @AutoMap()
  @Column({ type: 'enum', enum: ROLES })
  role: ROLES;

  @OneToMany(
    () => UsersProjectsEntity,
    (usersProjects) => usersProjects.user,
  )
  public projectsIncludes: UsersProjectsEntity[];
}
