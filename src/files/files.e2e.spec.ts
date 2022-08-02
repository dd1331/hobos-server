import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../app.module';

describe('Files', () => {
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
  beforeEach(async () => {});
  describe.skip('CREATE', () => {
    it('file upload', async () => {
      const res = await request(app.getHttpServer())
        .post('/files/upload')
        .attach('file', './package.json')
        .field('name', 'test')
        .expect(201);
    });
  });
});
