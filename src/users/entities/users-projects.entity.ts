import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import { BaseEntity } from '../../database/base.entity';
import { ACCESS_LEVEL } from '../../constants';
import { UsersEntity } from './users.entity';
import { ProjectsEntity } from '../../projects/entities/projects.entity';

@Entity('users_projects')
export class UsersProjectsEntity extends BaseEntity {
  @Column({ type: 'enum', enum: ACCESS_LEVEL })
  public accessLevel: ACCESS_LEVEL;

  @ManyToOne(
    () => UsersEntity,
    (user) => user.projectsIncludes,
  )
  @JoinColumn({
    foreignKeyConstraintName: 'fk_users_projects_user',
  })
  public user: UsersEntity;

  @ManyToOne(
    () => ProjectsEntity,
    (project) => project.usersIncludes,
  )
  @JoinColumn({
    foreignKeyConstraintName: 'fk_users_projects_project',
  })
  public project: ProjectsEntity;
}
