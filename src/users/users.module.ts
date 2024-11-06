import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from './entities/users.entity';
import { UsersController } from './controllers/users.controller';
import { UserProfile } from './profile/users.profile';

@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity])],
  providers: [UserService, UserProfile],
  controllers: [UsersController],
})
export class UsersModule {}
