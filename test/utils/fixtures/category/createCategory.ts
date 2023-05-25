import { INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CategoryEntity } from 'src/categories/entities/category.entity';
import { Repository } from 'typeorm';

export const createCategory = async (app: INestApplication, title: string) => {
  const categoryRepository = app.get<Repository<CategoryEntity>>(
    getRepositoryToken(CategoryEntity),
  );

  const category = categoryRepository.create({ title });
  await categoryRepository.save(category);

  return category;
};
