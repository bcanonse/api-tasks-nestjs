import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

import {
  ACCESS_LEVEL,
  ACCESS_LEVEL_KEY,
  ADMIN_KEY,
  PUBLIC_KEY,
  ROLES,
  ROLES_KEY,
} from 'src/constants';

import { UserService } from 'src/users/services/user.service';
import { ErrorManager } from 'src/utils';

@Injectable()
export class AccessLevelGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UserService,
  ) {}
  async canActivate(context: ExecutionContext) {
    try {
      const isPublic = this.reflector.get<boolean>(
        PUBLIC_KEY,
        context.getHandler(),
      );

      if (isPublic) {
        return true;
      }

      const roles = this.reflector.get<
        Array<keyof typeof ROLES>
      >(ROLES_KEY, context.getHandler());

      const accessLevel = this.reflector.get<
        keyof typeof ACCESS_LEVEL
      >(ACCESS_LEVEL_KEY, context.getHandler());

      const admin = this.reflector.get<string>(
        ADMIN_KEY,
        context.getHandler(),
      );

      const req = context
        .switchToHttp()
        .getRequest<Request>();

      const { roleUser, idUser } = req;

      if (accessLevel === undefined) {
        if (roles === undefined) {
          if (!admin) {
            return true;
          } else if (admin && roleUser === admin) {
            return true;
          } else {
            throw new ErrorManager({
              type: 'FORBIDDEN',
              message:
                'No tienes permisos para esta operacion',
            });
          }
        }
      }

      if (
        roleUser === ROLES.ADMIN ||
        roleUser === ROLES.CREATOR
      ) {
        return true;
      }

      const user = await this.userService.getUser(idUser);

      const userExistInProject = user.projectsIncludes.find(
        (project) =>
          project.project.id === req.params.projectId,
      );

      if (userExistInProject === undefined) {
        throw new ErrorManager({
          type: 'FORBIDDEN',
          message: 'No formas parte del proyecto',
        });
      }

      // DEVELOPER = 30,
      // MANTEINER = 40,
      // OWNER = 50,

      //30 > 40
      if (
        ACCESS_LEVEL[accessLevel] >
        userExistInProject.accessLevel
      ) {
        throw new ErrorManager({
          type: 'FORBIDDEN',
          message: 'No tienes el nivel de acceso necesario',
        });
      }

      return true;
    } catch (error) {
      throw ErrorManager.createSignatureError(
        error?.message,
      );
    }
  }
}
