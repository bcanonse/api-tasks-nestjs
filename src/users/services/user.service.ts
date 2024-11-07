import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigType } from '@nestjs/config';

import { DeleteResult, Repository } from 'typeorm';

import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';

import * as bcrypt from 'bcrypt';

import { UsersDto } from '../dto/user.dto';
import { CreateUserDto } from '../dto/create-user.dto';

import { UsersEntity } from '../entities/users.entity';
import { ErrorManager } from '../../utils';
import config from 'src/config/config';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly repository: Repository<UsersEntity>,
    @InjectMapper() private readonly mapper: Mapper,
    @Inject(config.KEY)
    private readonly configService: ConfigType<
      typeof config
    >,
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
      throw ErrorManager.createSignatureError(
        error?.message,
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
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: `User ${username} with email ${email} is already exists`,
        });

      const entity = this.mapper.map(
        createUser,
        CreateUserDto,
        UsersEntity,
      );

      entity.password = await bcrypt.hash(
        createUser.password,
        this.configService.hashSalt,
      );

      return await this.mapper.mapAsync(
        await this.repository.save(entity),
        UsersEntity,
        UsersDto,
      );
    } catch (error) {
      throw ErrorManager.createSignatureError(
        error?.message,
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
      throw ErrorManager.createSignatureError(
        error?.message,
      );
    }
  }

  public async getUser(
    id: string,
  ): Promise<UsersDto | null> {
    try {
      const user = await this.repository
        .createQueryBuilder('user')
        .where({ id })
        .leftJoinAndSelect(
          'user.projectsIncludes',
          'projectsIncludes',
        )
        .getOne();

      if (!user)
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: `User with ${id} not found`,
        });

      return this.mapper.map(user, UsersEntity, UsersDto);
    } catch (error) {
      throw ErrorManager.createSignatureError(
        error?.message,
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
      throw ErrorManager.createSignatureError(
        error?.message,
      );
    }
  }

  public async findBy({
    key,
    value,
  }: {
    key: keyof UsersDto;
    value: any;
  }) {
    try {
      const user = await this.repository
        .createQueryBuilder('user')
        .addSelect('user.password')
        .where({ [key]: value })
        .getOne();

      return user;
    } catch (error) {
      throw ErrorManager.createSignatureError(
        error?.message,
      );
    }
  }
}
