import { AutoMap } from '@automapper/classes';
import { IsNotEmpty, IsString } from 'class-validator';

export class ProjectsDto {
  @AutoMap()
  public readonly id: string;

  @IsNotEmpty()
  @IsString()
  public readonly name: string;

  @IsNotEmpty()
  @IsString()
  public readonly description: string;
}
