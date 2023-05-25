import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { initTestModule } from '../../config/init-test-module.config';
import { createUser } from 'test/utils/fixtures/user/createUser';
import { clearDB } from 'test/utils/clearDB';
import { createCategory } from 'test/utils/fixtures/category/createCategory';
import { CategoryEntity } from 'src/categories/entities/category.entity';

describe('DELETE category e2e', () => {
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

  it('should delete a category', async () => {
    await request(app.getHttpServer())
      .delete('/categories/' + category1.id)
      .set('Authorization', `Bearer ${jwt}`)
      .expect(200);

    const response = await request(app.getHttpServer())
      .get('/categories/' + category1.id)
      .set('Authorization', `Bearer ${jwt}`);

    expect(response.status).toBe(404);
  });
});
