import { AutoMap } from '@automapper/classes';

import { ROLES } from 'src/constants';

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
}
