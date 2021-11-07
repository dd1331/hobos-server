import { INestApplication, HttpStatus } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import each from 'jest-each';
import { AppModule } from '../../app.module';
import { UsersService } from '../users.service';
import { User } from '../entities/user.entity';
import { UpdateUserDto } from '../dto/update-user.dto';
const newUserParams = [
  {
    id: 1,
    userId: 'test id',
    userName: 'test',
    password: '123123',
    phone: '01000000000',
  },
  {
    id: 2,
    userId: 'test id 1',
    userName: 'test1',
    password: '123123',
    phone: '01000000001',
  },
  {
    id: 3,
    userId: 'test id 2',
    userName: 'test2',
    password: '123123',
    phone: '01000000002',
  },
];

describe('Users', () => {
  let app: INestApplication;
  let usersService: UsersService;
  const createdUsers: User[] = [];

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    usersService = moduleRef.get<UsersService>(UsersService);
    app = moduleRef.createNestApplication();
    await app.init();
  });
  afterAll(async () => {
    await app.close();
  });
  describe('CREATE', () => {
    each(newUserParams).it('/POST signup', async (newUser) => {
      const response = await request(app.getHttpServer())
        .post('/users/signup')
        .send(newUser)
        .expect(201);
      const { userId, userName, phone, role } = response.body;
      expect(userId).toBeTruthy();
      expect(userName).toBeTruthy();
      expect(phone).toBe(newUser.phone);
      expect(role).toBe('user');
      createdUsers.push(response.body);
    });
  });
  describe('READ', () => {
    it('/GET users', async () => {
      const { body } = await request(app.getHttpServer())
        .get('/users')
        .expect(HttpStatus.OK);
      const users = await usersService.findAll();
      expect(Array.isArray(body)).toBeTruthy();
      expect(body.length).toBe(users.length);
      expect(body[0].userId).toBeDefined();
      expect(body[0].userName).toBeDefined();
      expect(body[0].phone).toBeDefined();
      expect(body[0].role).toBeDefined();
    });
    it('/GET user', async () => {
      const userId = createdUsers[0].id;
      const { body } = await request(app.getHttpServer()).get(
        '/users/' + userId,
      );
      expect(body.id).toBe(userId);
      expect(body.userId).toBe(createdUsers[0].userId);
      expect(body.userName).toBe(createdUsers[0].userName);
      expect(body.phone).toBe(createdUsers[0].phone);
    });
    it('/GET user throw an error if user does not exist', async () => {
      const userId = -31;
      const { body } = await request(app.getHttpServer()).get(
        '/users/' + userId,
      );
      expect(body.statusCode).toBe(HttpStatus.NOT_FOUND);
      expect(body.message).toBe('user not found');
    });
  });
  describe('UPDATE', () => {
    const updateUserDto: UpdateUserDto = {
      userName: 'updated userName',
      userId: 'updated userId',
      password: 'updated password',
      phone: 'updated phone',
    };
    it('/PUT update user', async () => {
      const userId = createdUsers[0].id;
      const { body } = await request(app.getHttpServer())
        .patch('/users/' + userId)
        .send(updateUserDto);
      expect(body.userName).toBe(updateUserDto.userName);
      expect(body.userId).toBe(updateUserDto.userId);
      expect(body.password).toBe(updateUserDto.password);
      expect(body.phone).toBe(updateUserDto.phone);
    });
  });
  describe('DELETE', () => {
    it('/DELETE delete user', async () => {
      const userId = createdUsers[createdUsers.length - 1].id;
      const { body } = await request(app.getHttpServer()).delete(
        '/users/' + userId,
      );
      // TODO softdelete is working but returning user with deleted column value null
      // is it comming from transaction problem?
      // console.log(body);
      expect(body.deletedAt).toBeTruthy();
    });

    it('/DELETE throw an error if user does not exist', async () => {
      const userId = 9999;
      const { body } = await request(app.getHttpServer())
        .delete('/users/' + userId)
        .expect(HttpStatus.NOT_FOUND);
      expect(body.message).toBe('user not found');
    });
  });
  describe('/GET get profile', () => {
    it('get total posts', async () => {
      const { body } = await request(app.getHttpServer())
        .get('/users/profile/' + createdUsers[0].id)
        .expect(HttpStatus.OK);
      expect(body.postSum).toBeDefined();
      expect(body.commentSum).toBeDefined();
      expect(body.likeSum).toBeDefined();
      expect(body.avatar).toBeDefined();
    });
  });
});
