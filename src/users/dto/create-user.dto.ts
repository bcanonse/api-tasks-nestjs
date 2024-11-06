import { AutoMap } from '@automapper/classes';
import { Expose } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

import { ROLES } from 'src/constants';

export class CreateUserDto {
  @AutoMap()
  @IsNotEmpty()
  @IsString()
  @Expose({
    name: 'first_name',
  })
  public readonly firstName: string;

  @AutoMap()
  @IsNotEmpty()
  @IsString()
  @Expose({
    name: 'last_name',
  })
  public readonly lastName: string;

  @AutoMap()
  @IsNotEmpty()
  @IsNumber()
  public readonly age: number;

  @AutoMap()
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  public readonly email: string;

  @AutoMap()
  @IsNotEmpty()
  @IsString()
  public readonly username: string;

  @AutoMap()
  @IsNotEmpty()
  @IsString()
  public readonly password: string;

  @AutoMap()
  @IsNotEmpty()
  @IsEnum(ROLES)
  public readonly role: ROLES;
}
