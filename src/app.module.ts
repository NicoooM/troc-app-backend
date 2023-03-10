import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ItemsModule } from './items/items.module';
import { CategoriesModule } from './categories/categories.module';
import { AuthModule } from './auth/auth.module';
import { ResetPasswordTokenModule } from './reset-password-token/reset-password-token.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRESQL_ADDON_HOST,
      port: parseInt(process.env.POSTGRESQL_ADDON_PORT),
      username: process.env.POSTGRESQL_ADDON_USER,
      password: process.env.POSTGRESQL_ADDON_PASSWORD,
      database: process.env.POSTGRESQL_ADDON_DB,
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,
      autoLoadEntities: true,
    }),
    UsersModule,
    ItemsModule,
    CategoriesModule,
    AuthModule,
    ResetPasswordTokenModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
