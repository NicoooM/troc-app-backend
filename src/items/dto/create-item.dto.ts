import { CreateCategoryDto } from 'src/categories/dto/create-category.dto';
import { UploadFileEntity } from 'src/upload-file/entities/upload-file.entity';
import { CreateUserDto } from '../../users/dto/create-user.dto';

export class CreateItemDto {
  title: string;
  createdAt: Date;
  description: string;
  category: CreateCategoryDto;
  slug: string;
}
