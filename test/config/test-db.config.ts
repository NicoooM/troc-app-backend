import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const testDbConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.TEST_POSTGRESQL_ADDON_HOST || 'localhost',
  port: parseInt(process.env.TEST_POSTGRESQL_ADDON_PORT) || 5433,
  username: process.env.TEST_POSTGRESQL_ADDON_USER || 'root',
  password: process.env.TEST_POSTGRESQL_ADDON_PASSWORD || 'root',
  database: process.env.TEST_POSTGRESQL_ADDON_DB || 'mydbtest',
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: true,
  autoLoadEntities: true,
};
