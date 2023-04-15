import { CreateUserDto } from 'src/users/dto/create-user.dto';

export class CreateConnectedUserDto {
  socketId: string;
  user: CreateUserDto;
}
