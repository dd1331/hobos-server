import { INestApplication, HttpStatus } from '@nestjs/common';
import { AppModule } from '../app.module';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { HashtagsService } from './hashtags.service';
describe('Posts', () => {
  let app: INestApplication;
  let hashtagsService: HashtagsService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    hashtagsService = moduleRef.get<HashtagsService>(HashtagsService);
    app = moduleRef.createNestApplication();
    await app.init();
  });
  afterAll(async () => {
    await app.close();
  });
  beforeEach(async () => {});
  describe('GET getPopularPosts', () => {
    it('test', async () => {
      const res = await request(app.getHttpServer()).get('/hashtags');
    });
    it('test2', async () => {
      // const res = await hashtagsService.getPostIdsByHashtag(1);
    });
  });
});
