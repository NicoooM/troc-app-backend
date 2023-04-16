import { UserEntity } from 'src/users/entities/user.entity';

export class CreateRoomDto {
  firstUser: UserEntity;
  secondUser: number;
}
