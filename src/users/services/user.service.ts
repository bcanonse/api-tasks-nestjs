import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { DeleteResult, Repository } from 'typeorm';

import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';

import { UsersDto } from '../dto/user.dto';
import { CreateUserDto } from '../dto/create-user.dto';

import { UsersEntity } from '../entities/users.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly repository: Repository<UsersEntity>,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  // Private methods
  /**
   * Method for filter user if exits in db
   * @private method
   *
   * @usageNotes
   *
   * @param username string, username by filter in db
   * @param email string, email by filter in db
   */
  private async getUserByEmailAndUsername(
    username: string,
    email: string,
  ) {
    try {
      return await this.repository
        .createQueryBuilder('user')
        .where({
          username,
          email,
        })
        .getExists();
    } catch (error) {
      throw new HttpException(
        error?.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async createUser(
    createUser: CreateUserDto,
  ): Promise<UsersDto> {
    try {
      const { username, email } = createUser;

      if (
        await this.getUserByEmailAndUsername(
          username,
          email,
        )
      )
        throw new BadRequestException(
          `User ${username} with email ${email} is already exists`,
        );

      const entity = this.mapper.map(
        createUser,
        CreateUserDto,
        UsersEntity,
      );

      return await this.mapper.mapAsync(
        await this.repository.save(entity),
        UsersEntity,
        UsersDto,
      );
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new HttpException(
        error?.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async getUsers(): Promise<UsersDto[]> {
    try {
      const users = await this.repository.find();
      const usersDto = await this.mapper.mapArrayAsync(
        users,
        UsersEntity,
        UsersDto,
      );
      return usersDto;
    } catch (error) {
      throw new HttpException(
        error?.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async getUser(
    id: string,
  ): Promise<UsersDto | null> {
    try {
      const user = await this.repository.findOneBy({ id });

      if (!user)
        throw new NotFoundException(
          `User with ${id} not found`,
        );

      return this.mapper.map(user, UsersEntity, UsersDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new HttpException(
        error?.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async delete(id: string) {
    try {
      const user = await this.getUser(id);

      const deleted: DeleteResult =
        await this.repository.delete(user.id);

      if (deleted.affected === 0) throw new Error();

      return true;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new HttpException(
        error?.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
