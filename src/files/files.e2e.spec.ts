import * as request from 'supertest';
import { INestApplication, HttpStatus } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { FilesService } from './files.service';

describe('Files', () => {
  let app: INestApplication;
  let filesService: FilesService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    filesService = moduleRef.get<FilesService>(FilesService);
    app = moduleRef.createNestApplication();
    await app.init();
  });
  afterAll(async () => {
    await app.close();
  });
  beforeEach(async () => {});
  describe('CREATE', () => {
    it('test', async () => {
      const res = await request(app.getHttpServer())
        .post('/files/upload')
        .attach('file', './package.json')
        .field('name', 'test');
      // .expect(201);
      // console.log(res);
    });
  });
});
