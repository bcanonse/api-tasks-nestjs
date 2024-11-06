import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';
import { CORS, API } from './config';
import helmet from 'helmet';
import {
  BadRequestException,
  ValidationPipe,
} from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const env = configService.get<string>(
    'NODE_ENV',
    'development',
  );

  app.use(helmet());
  // Global prefix routes endpoints for example: host:port/api/users and api/tasks
  app.setGlobalPrefix(API);

  // Add cors config
  app.enableCors(CORS);

  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      disableErrorMessages: env === 'production',
      exceptionFactory: (errors) => {
        const result = errors.map((error) => ({
          property: error.property,
          message:
            error.constraints[
              Object.keys(error.constraints)[0]
            ],
        }));
        return new BadRequestException(result);
      },
    }),
  );

  const port = configService.get<number>('PORT', 3000);

  await app.listen(port);

  console.info(
    `Application running on: ${await app.getUrl()}`,
  );
}
bootstrap();
