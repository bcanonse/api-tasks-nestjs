import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

import { PUBLIC_KEY } from 'src/constants';
import { UserService } from 'src/users/services/user.service';
import { ErrorManager } from 'src/utils';
import { IUseToken } from '../interfaces/auth.interface';
import { useToken } from 'src/utils/use.token';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly reflector: Reflector,
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

      const req = context
        .switchToHttp()
        .getRequest<Request>();

      const token = req.headers['api_token'];

      if (!token || Array.isArray(token)) {
        throw new ErrorManager({
          type: 'UNAUTHORIZED',
          message: 'Invalid token',
        });
      }

      const manageToken: IUseToken | string =
        useToken(token);

      if (typeof manageToken === 'string') {
        throw new ErrorManager({
          type: 'UNAUTHORIZED',
          message: manageToken,
        });
      }

      if (manageToken.isExpired) {
        throw new ErrorManager({
          type: 'UNAUTHORIZED',
          message: 'Token expired',
        });
      }

      const { sub } = manageToken;

      const user = await this.userService.getUser(sub);

      if (!user) {
        throw new ErrorManager({
          type: 'UNAUTHORIZED',
          message: 'Invalid user',
        });
      }

      req.idUser = user.id;
      req.roleUser = user.role;
      return true;
    } catch (error) {
      throw ErrorManager.createSignatureError(
        error?.message,
      );
    }
  }
}
