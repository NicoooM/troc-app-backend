import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomEntity } from './entities/room.entity';
import { MessagesModule } from 'src/messages/messages.module';
import { MessageEntity } from 'src/messages/entities/message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RoomEntity, MessageEntity])],
  controllers: [RoomsController],
  providers: [RoomsService],
  exports: [RoomsService],
})
export class RoomsModule {}
