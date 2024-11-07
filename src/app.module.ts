import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { environments } from './environments';
import config from './config/config';
import { DatabaseModule } from './database/database.module';
import { validate } from './config/env.validation';
import { ProjectsModule } from './projects/projects.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:
        environments[process.env.NODE_ENV] ?? '.env',
      load: [config],
      validate,
      isGlobal: true,
      cache: true,
    }),
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
    DatabaseModule,
    ProjectsModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
