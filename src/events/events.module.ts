import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { ConnectedUsersModule } from 'src/connected-users/connected-users.module';
import { RoomsModule } from 'src/rooms/rooms.module';
import { MessagesModule } from 'src/messages/messages.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ConnectedUsersModule,
    RoomsModule,
    MessagesModule,
  ],
  providers: [EventsGateway],
})
export class EventsModule {}
