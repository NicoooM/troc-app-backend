import { NestExpressApplication } from '@nestjs/platform-express';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { CategoriesModule } from 'src/categories/categories.module';
import { testDbConfig } from 'test/config/test-db.config';
import { ConnectedUsersModule } from 'src/connected-users/connected-users.module';
import { EventsModule } from 'src/events/events.module';
import { ItemsModule } from 'src/items/items.module';
import { MailModule } from 'src/mail/mail.module';
import { MessagesModule } from 'src/messages/messages.module';
import { ResetPasswordTokenModule } from 'src/reset-password-token/reset-password-token.module';
import { RoomsModule } from 'src/rooms/rooms.module';
import { UploadFileModule } from 'src/upload-file/upload-file.module';
import { UsersModule } from 'src/users/users.module';

export const initTestModule = async (app: INestApplication) => {
  const moduleFixture = await Test.createTestingModule({
    imports: [
      TypeOrmModule.forRoot(testDbConfig),
      UsersModule,
      ItemsModule,
      CategoriesModule,
      AuthModule,
      ResetPasswordTokenModule,
      MailModule,
      UploadFileModule,
      EventsModule,
      ConnectedUsersModule,
      MessagesModule,
      RoomsModule,
    ],
  }).compile();

  app = moduleFixture.createNestApplication<INestApplication>();
  await app.init();
  return app;
};
