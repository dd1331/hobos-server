import { Test } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { INestApplication, HttpStatus } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as request from 'supertest';

describe('LocalsService', () => {
  let app: INestApplication;
  let agent;
  let user: User;
  let accessToken: string;
  const createUserDto: CreateUserDto = {
    userId: 'testUserId',
    userName: 'testUserName',
    password: '123123',
    phone: '01000000002',
  };
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
    agent = app.getHttpServer();
    const userResult = await request(agent)
      .post('/users/signup')
      .send(createUserDto);
    user = userResult.body;

    const tokenResult = await request(agent).post('/auth/jwt').send({
      phone: createUserDto.phone,
      password: createUserDto.password,
    });
    accessToken = tokenResult.body.accessToken;
  });
  afterAll(async () => {
    await app.close();
  });

  describe('', () => {
    it('유효성 체크', async () => {
      const messages = [
        'content 값이 존재하지 않습니다',
        'code 값이 존재하지 않습니다',
        'type 값이 존재하지 않습니다',
      ];
      const { body } = await request(agent)
        .post('/locals/review')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.BAD_REQUEST);
      expect(body.message.every((m) => messages.includes(m)));
    });
    it('로그인 정보 없음', async () => {
      const { body } = await request(agent)
        .post('/locals/review')
        .send({ content: 'testes', cityCode: 11100 })
        .expect(HttpStatus.UNAUTHORIZED);
    });
    it('cityCode 유효하지 않음', async () => {
      const { body } = await request(agent)
        .post('/locals/review')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ content: 'testes', cityCode: 111000 });
      expect(body.statusCode).toBe(HttpStatus.NOT_FOUND);
      expect(body.message).toBe('지역정보가 존재하지 않습니다');
    });
    it('성공', async () => {
      const { body } = await request(agent)
        .post('/locals/review')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ content: 'testes', cityCode: 11100 })
        .expect(HttpStatus.CREATED);
      expect(body.userId).toBe(user.id);
    });
  });
});
