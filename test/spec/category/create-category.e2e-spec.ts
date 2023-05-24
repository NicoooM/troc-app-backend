import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { initTestModule } from '../../config/init-test-module.config';
import { createUser } from 'test/utils/createUser';
import { clearDB } from 'test/utils/clearDB';

describe('Create category', () => {
  let app: INestApplication;
  let jwt: string;

  beforeAll(async () => {
    app = await initTestModule(app);
    const response = await createUser(app);
    jwt = response.access_token;
  });

  afterAll(async () => {
    await clearDB(app);
    await app.close();
  });

  it('should create a category', async () => {
    const createCategoryData = {
      title: 'category 1',
    };

    const response = await request(app.getHttpServer())
      .post('/categories')
      .set('Authorization', `Bearer ${jwt}`)
      .send(createCategoryData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('title');
    expect(response.body.title).toBe(createCategoryData.title);
  });
});
