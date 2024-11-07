import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Request } from 'express';
import { Observable } from 'rxjs';

import {
  ADMIN_KEY,
  PUBLIC_KEY,
  ROLES,
  ROLES_KEY,
} from 'src/constants';
import { ErrorManager } from 'src/utils';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
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

      const admin = this.reflector.get<string>(
        ADMIN_KEY,
        context.getHandler(),
      );

      const req = context
        .switchToHttp()
        .getRequest<Request>();

      const { roleUser } = req;

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

      if (roleUser === ROLES.ADMIN) {
        return true;
      }

      const isAuth = roles.some(
        (role) => role === roleUser,
      );

      if (!isAuth) {
        throw new ErrorManager({
          type: 'FORBIDDEN',
          message: 'No tienes permisos para esta operacion',
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
