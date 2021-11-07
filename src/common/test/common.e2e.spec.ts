import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../app.module';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { CommonService } from '../common.service';
describe('Posts', () => {
  let app: INestApplication;
  let commonService: CommonService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    commonService = moduleRef.get<CommonService>(CommonService);
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
