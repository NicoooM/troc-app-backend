import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { initTestModule } from '../../config/init-test-module.config';
import { clearDB } from 'test/utils/clearDB';
import { createCategory } from 'test/utils/fixtures/category/createCategory';
import { CategoryEntity } from 'src/categories/entities/category.entity';

describe('GET categories e2e', () => {
  let app: INestApplication;
  let category1: CategoryEntity;
  let category2: CategoryEntity;

  beforeEach(async () => {
    app = await initTestModule(app);
    category1 = await createCategory(app, 'category1');
    category2 = await createCategory(app, 'category2');
  });

  afterAll(async () => {
    await clearDB(app);
    await app.close();
  });

  it('should get categories', async () => {
    const response = await request(app.getHttpServer()).get('/categories');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0].title).toBe(category1.title);
    expect(response.body[1].title).toBe(category2.title);
  });
});
