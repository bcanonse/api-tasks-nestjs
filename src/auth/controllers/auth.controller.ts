import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from '../services/auth.service';
import { AuthDto } from '../dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() { username, password }: AuthDto) {
    return await this.authService.login(username, password);
  }
}
