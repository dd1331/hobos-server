import { Test, TestingModule } from '@nestjs/testing';
import { WingmanService } from './wingman.service';
import { UsersService } from '../users/users.service';
import { PostsService } from '../posts/posts.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Post } from '../posts/entities/post.entity';
import { Like } from '../like/entities/like.entity';
import { File } from '../files/entities/file.entity';
import { Hashtag } from '../hashtags/entities/hashtag.entity';
import { PostHashtag } from '../posts/entities/post_hashtag.entity';
import { CacheService } from '../cache/cache.service';
import { HashtagsService } from '../hashtags/hashtags.service';
import { CACHE_MANAGER } from '@nestjs/common';
import { FilesService } from '../files/files.service';

describe('WingmanService', () => {
  let service: WingmanService;

  beforeEach(async () => {
    //   const module: TestingModule = await Test.createTestingModule({
    //     providers: [
    //       WingmanService,
    //       UsersService,
    //       PostsService,
    //       HashtagsService,
    //       CacheService,
    //       FilesService,
    //       { provide: getRepositoryToken(Like), useValue: {} },
    //       { provide: getRepositoryToken(File), useValue: {} },
    //       { provide: getRepositoryToken(Hashtag), useValue: {} },
    //       { provide: getRepositoryToken(PostHashtag), useValue: {} },
    //       { provide: CACHE_MANAGER, useValue: {} },
    //       {
    //         provide: getRepositoryToken(User),
    //         useValue: {
    //           create: jest.fn(),
    //           find: jest.fn(),
    //           update: jest.fn(),
    //           delete: jest.fn(),
    //           findOne: jest.fn(),
    //           softDelete: jest.fn(),
    //           save: jest.fn(),
    //         },
    //       },
    //       {
    //         provide: getRepositoryToken(Post),
    //         useValue: {
    //           create: jest.fn(),
    //           find: jest.fn(),
    //           update: jest.fn(),
    //           delete: jest.fn(),
    //           findOne: jest.fn(),
    //           softDelete: jest.fn(),
    //           save: jest.fn(),
    //         },
    //       },
    //       {
    //         provide: getRepositoryToken(Like),
    //         useValue: {
    //           create: jest.fn(),
    //           find: jest.fn(),
    //           update: jest.fn(),
    //           delete: jest.fn(),
    //           findOne: jest.fn(),
    //           softDelete: jest.fn(),
    //           save: jest.fn(),
    //         },
    //       },
    //       {
    //         provide: getRepositoryToken(File),
    //         useValue: {
    //           create: jest.fn(),
    //           find: jest.fn(),
    //           update: jest.fn(),
    //           delete: jest.fn(),
    //           findOne: jest.fn(),
    //           softDelete: jest.fn(),
    //           save: jest.fn(),
    //         },
    //       },
    //     ],
    //   }).compile();
    //   service = module.get<WingmanService>(WingmanService);
  });

  it('should be defined', () => {
    // expect(service).toBeDefined();
  });
  describe('dd', () => {
    it('test', async () => {
      // expect(service.uploadImage).toBeDefined();
    });
  });
});
