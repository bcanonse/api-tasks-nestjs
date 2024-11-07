import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from './entities/users.entity';
import { UsersController } from './controllers/users.controller';
import { UserProfile } from './profile/users.profile';
import { ProvidersModule } from 'src/providers/providers.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersEntity]),
    ProvidersModule,
  ],
  providers: [UserService, UserProfile],
  controllers: [UsersController],
  exports: [UserService],
})
export class UsersModule {}
