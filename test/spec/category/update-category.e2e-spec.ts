import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { initTestModule } from '../../config/init-test-module.config';
import { createUser } from 'test/utils/fixtures/user/createUser';
import { clearDB } from 'test/utils/clearDB';
import { createCategory } from 'test/utils/fixtures/category/createCategory';
import { CategoryEntity } from 'src/categories/entities/category.entity';

describe('PATCH category e2e', () => {
  let app: INestApplication;
  let jwt: string;
  let category1: CategoryEntity;

  beforeEach(async () => {
    app = await initTestModule(app);
    const response = await createUser(app);
    jwt = response.access_token;
    category1 = await createCategory(app, 'category1');
  });

  afterAll(async () => {
    await clearDB(app);
    await app.close();
  });

  it('should update a category', async () => {
    const updateCategoryData = {
      title: 'category1 updated',
    };

    await request(app.getHttpServer())
      .patch('/categories/' + category1.id)
      .set('Authorization', `Bearer ${jwt}`)
      .send(updateCategoryData);

    const response = await request(app.getHttpServer())
      .get('/categories/' + category1.id)
      .set('Authorization', `Bearer ${jwt}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('title');
    expect(response.body.title).toBe(updateCategoryData.title);
  });
});
