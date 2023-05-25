import { INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import * as request from 'supertest';
import { Repository } from 'typeorm';

export const createUser = async (app: INestApplication) => {
  const userRepository = app.get<Repository<UserEntity>>(
    getRepositoryToken(UserEntity),
  );

  const email = 'test@example.com';
  const password = 'password';
  const username = 'test';

  userRepository.create({ email, password, username });

  const login = await request(app.getHttpServer())
    .post('/auth/login')
    .send({ email, password });

  return login.body;
};
