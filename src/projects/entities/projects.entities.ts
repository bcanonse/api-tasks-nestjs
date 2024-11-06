import { Column, Entity } from 'typeorm';

import { BaseEntity } from '../../database/base.entity';

@Entity('projects')
export class ProjectsEntity extends BaseEntity {
  @Column('varchar', {
    comment: 'Name of project',
    length: 100,
  })
  public readonly name: string;

  @Column('varchar', {
    comment: 'Description of project',
    length: 255,
  })
  public readonly description: string;
}
