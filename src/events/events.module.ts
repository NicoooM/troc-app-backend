import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { ConnectedUsersModule } from 'src/connected-users/connected-users.module';
import { RoomsModule } from 'src/rooms/rooms.module';

@Module({
  imports: [AuthModule, UsersModule, ConnectedUsersModule, RoomsModule],
  providers: [EventsGateway],
})
export class EventsModule {}
