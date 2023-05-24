import { INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CategoryEntity } from 'src/categories/entities/category.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

export const clearDB = async (app: INestApplication) => {
  const categoryRepository = app.get<Repository<CategoryEntity>>(
    getRepositoryToken(CategoryEntity),
  );
  const userRepository = app.get<Repository<UserEntity>>(
    getRepositoryToken(UserEntity),
  );

  await categoryRepository.delete({});
  await userRepository.delete({});
};
