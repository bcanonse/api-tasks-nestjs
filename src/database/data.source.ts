import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import {
  ConfigModule,
  ConfigService,
} from '@nestjs/config';

import { getSsl } from './get-ssl';
import { environments } from '../environments';

const ssl = getSsl();

ConfigModule.forRoot({
  envFilePath: environments[process.env.NODE_ENV] || '.env',
});

const configService = new ConfigService();

export const DataSourceConfig: DataSourceOptions = {
  type: 'postgres',
  ssl,
  url: configService.get('DATABASE_URL'),
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: false,
  namingStrategy: new SnakeNamingStrategy(),
  migrations: [__dirname + '/../../migrations/*.ts'],
  migrationsTableName: 'migrations',
};

export const AppDataSource = new DataSource(
  DataSourceConfig,
);
