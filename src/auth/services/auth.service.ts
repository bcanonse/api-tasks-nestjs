import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import config from 'src/config/config';
import { UsersEntity } from 'src/users/entities/users.entity';

import { UserService } from 'src/users/services/user.service';
import {
  AuthResponse,
  PayloadToken,
} from '../interfaces/auth.interface';
import { ErrorManager } from 'src/utils';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    @Inject(config.KEY)
    private readonly configService: ConfigType<
      typeof config
    >,
  ) {}

  private async validateUser(
    username: string,
    password: string,
  ) {
    const userByUserName = await this.usersService.findBy({
      key: 'username',
      value: username,
    });

    const userByEmail = await this.usersService.findBy({
      key: 'email',
      value: username,
    });

    if (userByUserName) {
      const match = await bcrypt.compare(
        password,
        userByUserName.password,
      );
      if (match) return userByUserName;
    }

    if (userByEmail) {
      const match = await bcrypt.compare(
        password,
        userByEmail.password,
      );
      if (match) return userByEmail;
    }

    return null;
  }

  public async login(username: string, password: string) {
    try {
      const userValidate = await this.validateUser(
        username,
        password,
      );

      if (!userValidate) {
        throw new ErrorManager({
          type: 'UNAUTHORIZED',
          message: 'Data not valid',
        });
      }

      const jwt = await this.generateJWT(userValidate);

      return jwt;
    } catch (error) {
      throw ErrorManager.createSignatureError(
        error?.message,
      );
    }
  }

  private signJWT({
    payload,
    secret,
    expires,
  }: {
    payload: jwt.JwtPayload;
    secret: string;
    expires: number | string;
  }): string {
    return jwt.sign(payload, secret, {
      expiresIn: expires,
    });
  }

  private async generateJWT(
    user: UsersEntity,
  ): Promise<AuthResponse> {
    const getUser = await this.usersService.getUser(
      user.id,
    );

    const payload: PayloadToken = {
      role: getUser.role,
      sub: getUser.id,
    };

    return {
      accessToken: this.signJWT({
        payload,
        secret: this.configService.jwt.secret,
        expires: this.configService.jwt.expiresIn,
      }),
      user,
    };
  }
}
