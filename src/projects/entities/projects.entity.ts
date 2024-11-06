import { Column, Entity, OneToMany } from 'typeorm';

import { BaseEntity } from '../../database/base.entity';
import { UsersProjectsEntity } from '../../users/entities/users-projects.entity';

@Entity('projects')
export class ProjectsEntity extends BaseEntity {
  @Column('varchar', {
    comment: 'Name of project',
    length: 100,
  })
  public name: string;

  @Column('varchar', {
    comment: 'Description of project',
    length: 255,
  })
  public description: string;

  @OneToMany(
    () => UsersProjectsEntity,
    (usersProjects) => usersProjects.project,
  )
  public usersIncludes: UsersProjectsEntity[];
}
