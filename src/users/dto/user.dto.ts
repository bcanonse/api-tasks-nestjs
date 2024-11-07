import { AutoMap } from '@automapper/classes';

import { ROLES } from '../../constants';
import { UsersProjectsDto } from './user-project.dto';

export class UsersDto {
  @AutoMap()
  public readonly id: string;

  @AutoMap()
  public readonly firstName: string;

  @AutoMap()
  public readonly lastName: string;

  @AutoMap()
  public readonly age: number;

  @AutoMap()
  public readonly email: string;

  @AutoMap()
  public readonly username: string;

  @AutoMap(() => String)
  public readonly role: ROLES;

  @AutoMap(() => UsersProjectsDto)
  public readonly projectsIncludes: UsersProjectsDto[];
}
