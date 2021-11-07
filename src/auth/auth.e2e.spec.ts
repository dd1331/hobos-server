import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';
import { LoginDto } from '../auth/dto/login-dto';

describe('Auth', () => {
  let app: INestApplication;
  let usersService: UsersService;
  let agent;
  let accessToken: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    usersService = moduleRef.get<UsersService>(UsersService);
    await usersService.create({
      id: 2,
      userId: 'test id 2',
      userName: 'test2',
      password: '123123',
      phone: '01000000002',
    });
    app = moduleRef.createNestApplication();
    await app.init();
    agent = app.getHttpServer();
  });
  afterAll(async () => {
    await app.close();
  });
  describe('Login', () => {
    it('get accessToken', async () => {
      const loginDto: LoginDto = {
        phone: '01000000002',
        password: '123123',
      };
      const { body } = await request(agent).post('/auth/login').send(loginDto);
      accessToken = body.accessToken;

      return;
    });
    it('fail to pass jwt guard', async () => {
      await request(agent).get('/auth/test').expect(401);
    });
    it('succeed to pass jwt guard', async () => {
      await request(agent)
        .get('/auth/test')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
    });
  });
});
