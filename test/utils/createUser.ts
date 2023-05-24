import * as request from 'supertest';

export const createUser = async (app) => {
  const email = 'test@example.com';
  const password = 'password';
  const username = 'test';

  await request(app.getHttpServer())
    .post('/auth/register')
    .send({ email, password, username })
    .expect(201);

  const login = await request(app.getHttpServer())
    .post('/auth/login')
    .send({ email, password })
    .expect(201);

  return login.body;
};
