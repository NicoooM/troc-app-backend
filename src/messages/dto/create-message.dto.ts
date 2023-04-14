import { RoomEntity } from 'src/rooms/entities/room.entity';
import { UserEntity } from 'src/users/entities/user.entity';

export class CreateMessageDto {
  content: string;
  sender: UserEntity;
  receiver: number;
  room: number;
}
