import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CommentsService } from '../../comments/comments.service';
import { LikesService } from '../../like/likes.service';
import { PostsService } from '../../posts/posts.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';
import { UsersService } from '../users.service';

const newUsers = [
  {
    id: 0,
    userId: 'test id',
    userName: 'test',
    password: '123123',
    phone: '01000000000',
  },
  {
    id: 1,
    userId: 'test id 1',
    userName: 'test1',
    password: '123123',
    phone: '01000000001',
  },
  {
    id: 2,
    userId: 'test id 2',
    userName: 'test2',
    password: '123123',
    phone: '01000000002',
  },
];
describe('UsersService', () => {
  let service: UsersService;
  let mockedUserRepo;
  beforeEach(async () => {
    mockedUserRepo = {
      find: jest.fn().mockResolvedValue(newUsers),
      findOneOrFail: jest.fn().mockResolvedValue('oneCat'),
      create: jest.fn().mockReturnValue(newUsers[0]),
      save: jest.fn().mockImplementation((data) => Promise.resolve(data)),
      update: jest.fn().mockResolvedValue(true),
      delete: jest.fn().mockResolvedValue(true),
      findOne: jest.fn().mockReturnValue(newUsers[0]),
      softDelete: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: mockedUserRepo },
        { provide: PostsService, useValue: {} },
        { provide: CommentsService, useValue: {} },
        { provide: LikesService, useValue: {} },
      ],
    }).compile();
    service = module.get<UsersService>(UsersService);
  });
  describe('create', () => {
    it('succeed', async () => {
      const dto: CreateUserDto = { phone: '01000000000', password: '123' };
      mockedUserRepo.findOne.mockResolvedValueOnce(null);
      const res = await service.create(dto);
      expect(res).toBeTruthy();
    });
    it('duplicated phone number', async () => {
      const dto: CreateUserDto = { phone: '01000000000', password: '123' };
      mockedUserRepo.findOne.mockResolvedValueOnce({});
      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });
  });
});
