import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UsersDto } from '../dto/user.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { PublicAccess } from 'src/auth/decorators/public.decorator.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AccessLevelGuard } from 'src/auth/guards/access-level.guard';

@Controller('users')
@UseGuards(AuthGuard, RolesGuard, AccessLevelGuard)
export class UsersController {
  constructor(private readonly usersService: UserService) {}

  @Roles('ADMIN')
  @Get()
  async get(): Promise<UsersDto[]> {
    return await this.usersService.getUsers();
  }

  @Get(':id')
  async getById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<UsersDto | null> {
    return await this.usersService.getUser(id);
  }

  @PublicAccess()
  @Post()
  async create(
    @Body() payload: CreateUserDto,
  ): Promise<UsersDto> {
    return await this.usersService.createUser(payload);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return await this.usersService.delete(id);
  }
}
