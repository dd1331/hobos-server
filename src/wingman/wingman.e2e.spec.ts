import { Test } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { INestApplication } from '@nestjs/common';
import { WingmanService } from './wingman.service';
// import * as request from 'supertest';

describe('wingman', () => {
  let app: INestApplication;
  let wingmanService: WingmanService;
  // const agent = request(app.getHttpServer());
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    wingmanService = moduleRef.get<WingmanService>(WingmanService);
    app = moduleRef.createNestApplication();
    await app.init();
  });
  afterAll(async () => {
    // const userRepo: Repository<User> = new Repository<User>();
    // const postRepo: Repository<Post> = new Repository<Post>();
    await app.close();
  });
  describe('test', () => {
    it('test', async () => {
      // await wingmanService.crawlInstizFreeBoard();
    });
  });
});
