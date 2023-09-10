import { CreateCategoryDto } from 'src/categories/dto/create-category.dto';

export class CreateItemDto {
  title: string;
  createdAt: Date;
  description: string;
  category: CreateCategoryDto;
  slug: string;
}
