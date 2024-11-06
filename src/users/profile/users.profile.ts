import { Injectable } from '@nestjs/common';

import {
  createMap,
  forMember,
  ignore,
  Mapper,
  MappingProfile,
} from '@automapper/core';
import {
  AutomapperProfile,
  InjectMapper,
} from '@automapper/nestjs';

import { UsersEntity } from '../entities/users.entity';
import { UsersDto } from '../dto/user.dto';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class UserProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, UsersEntity, UsersDto);
      createMap(
        mapper,
        CreateUserDto,
        UsersEntity,
        forMember((dest) => dest.id, ignore()),
      );
    };
  }
}
