import { AutoMap } from '@automapper/classes';
import { UsersDto } from './user.dto';
import { ACCESS_LEVEL } from 'src/constants';
import { ProjectsDto } from 'src/projects/dto/project.dto';

export class UsersProjectsDto {
  @AutoMap(() => String)
  public readonly accessLevel: ACCESS_LEVEL;

  @AutoMap(() => UsersDto)
  public readonly user: UsersDto;

  @AutoMap(() => ProjectsDto)
  public readonly project: ProjectsDto;
}
