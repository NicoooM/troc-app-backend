import { CreateUserDto } from '../../users/dto/create-user.dto';

export class CreateItemDto {
  title: string;
  createdAt: Date;
  description: string;
  user: CreateUserDto;
}
