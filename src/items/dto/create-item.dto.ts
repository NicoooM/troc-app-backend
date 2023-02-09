import { CreateCategoryDto } from 'src/categories/dto/create-category.dto';
import { CreateUserDto } from '../../users/dto/create-user.dto';

export class CreateItemDto {
  title: string;
  createdAt: Date;
  description: string;
  category: CreateCategoryDto;
}
