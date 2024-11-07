import { UsersEntity } from '../../users/entities/users.entity';
import { ROLES } from '../../constants';

export interface PayloadToken {
  sub: string;
  role: ROLES;
}

export interface AuthResponse {
  accessToken: string;
  user: UsersEntity;
}

export interface AuthTokenResult {
  role: string;
  sub: string;
  iat: number;
  exp: number;
}

export interface IUseToken {
  role: string;
  sub: string;
  isExpired: boolean;
}
