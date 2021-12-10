import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../app.module';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
describe('Common', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });
  afterAll(async () => {
    await app.close();
  });
  beforeEach(async () => {
    return;
  });
  describe('/Get get categories', () => {
    it('should return post categories', async () => {
      const { body } = await request(app.getHttpServer()).get(
        `/common/categories/board`,
      );
    });
  });
});
