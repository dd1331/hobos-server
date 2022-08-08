import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from '../posts.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Post } from '../entities/post.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Like } from '../../like/entities/like.entity';
import { CreatePostDto } from '../dto/create-post.dto';
import { File } from '../../files/entities/file.entity';
import { UsersService } from '../../users/users.service';
import { User } from '../../users/entities/user.entity';
import { HashtagsService } from '../../hashtags/hashtags.service';
import { Hashtag } from '../../hashtags/entities/hashtag.entity';
import { PostHashtag } from '../entities/post_hashtag.entity';
import { CommentsService } from '../../comments/comments.service';
import { LikesService } from '../../like/likes.service';
import { RecommendedPost } from '../entities/recommended_post.entity';
import { Comment } from '../../comments/entities/comment.entity';
import { ChildComment } from '../../comments/entities/child_comment.entity';
import { UpdatePostDto } from '../dto/update-post.dto';
import { DataSource } from 'typeorm';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';

const moduleMocker = new ModuleMocker(global);

describe('PostsService', () => {
  let postsService: PostsService;
  let mockedPostRepo;
  let mockedFileRepo;
  let manager;

  beforeEach(async () => {
    mockedPostRepo = {
      findOne: jest.fn().mockImplementation(({ where: { id } }) =>
        Promise.resolve({
          // FIXME: better way
          id,
          views: 0,
          read: new Post().read,
        }),
      ),
      findOneBy: ({ id }): Promise<Partial<Post>> => {
        return Promise.resolve({ id, views: 0 });
      },
      create: (dto: Partial<CreatePostDto>): Promise<Partial<Post>> => {
        return Promise.resolve({ ...dto });
      },
      save: (dto: Partial<Post>) => {
        return Promise.resolve({ ...dto });
      },
      softRemove: jest.fn().mockImplementation((entity) => {
        entity.deletedAt = new Date();
        return Promise.resolve(entity);
      }),
    };
    mockedFileRepo = {
      find: (): Promise<Partial<File>[]> => {
        return Promise.resolve([
          {
            url: 'www.test.com',
            key: 'fadsfdsfsad',
            eTag: 'etag',
          },
        ]);
      },
    };
    manager = {
      create: jest.fn().mockImplementation((data) => Promise.resolve(data)),
      save: jest.fn().mockImplementation((data) => Promise.resolve(data)),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        PostsService,
        HashtagsService,
        CommentsService,
        LikesService,
        Post,
        { provide: getRepositoryToken(File), useValue: mockedFileRepo },
        { provide: getRepositoryToken(Comment), useValue: {} },
        { provide: getRepositoryToken(ChildComment), useValue: {} },
        { provide: getRepositoryToken(RecommendedPost), useValue: {} },
        { provide: getRepositoryToken(User), useValue: {} },
        { provide: getRepositoryToken(Hashtag), useValue: {} },
        { provide: getRepositoryToken(PostHashtag), useValue: {} },
        { provide: getRepositoryToken(Post), useValue: mockedPostRepo },
        { provide: getRepositoryToken(Like), useValue: {} },
      ],
    })
      .useMocker((token) => {
        if (token === DataSource) {
          return {
            transaction: (callback) => callback(manager),
          };
        }
        if (typeof token === 'function') {
          const mockMetadata = moduleMocker.getMetadata(
            token,
          ) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();
    postsService = module.get<PostsService>(PostsService);
  });

  describe('readPostAndCount', () => {
    it('존재하는 경우 Post 리턴', async () => {
      const id = 3;
      const result = await postsService.readPostAndCount(id);
      expect(result.id).toBe(id);
    });
    it('존재하지 않는 경우 NotFoundException', async () => {
      mockedPostRepo.findOne = () => Promise.resolve(null);
      const result = () => postsService.readPostAndCount(111);
      expect(result()).rejects.toThrow(NotFoundException);
      // TODO add custom message test
    });
  });
  describe('createPost', () => {
    const payload: CreatePostDto = {
      poster: 1,
      title: 'test',
      content: 'test content',
      category: 'free',
    };
    it('포스트 작성 성공', async () => {
      const result = await postsService.createPost(payload);
      expect(result).toBeTruthy();
    });
    it('포스트 작성 실패', async () => {
      manager.save.mockRejectedValueOnce(new BadRequestException());
      expect(postsService.createPost(payload)).rejects.toThrow(
        BadRequestException,
      );
    });
    it('dto에 fileId가 존재하는 경우 post는 files를 포함', async () => {
      const payloadWithFileId: CreatePostDto = { ...payload, fileId: 2 };
      const result = await postsService.createPost(payloadWithFileId);
      expect(result.files.length).toBeGreaterThan(0);
    });
  });
  describe('updatePost', () => {
    const payload: UpdatePostDto = {
      poster: 1,
      title: 'updated title',
      content: 'updated content',
      id: 1,
    };
    it('기본 포스트 업데이트 성공', async () => {
      const result = await postsService.updatePost(payload);
      expect(result.title).toBe(payload.title);
      expect(result.content).toBe(payload.content);
    });
    it('포스트 파일 업데이트 성공', async () => {
      expect.assertions(1);
      const fileId = 1;
      const payloadWithFileId: UpdatePostDto = { ...payload, fileId };
      const result = await postsService.updatePost(payloadWithFileId);

      expect(result.files.length).toBeGreaterThan(0);
    });
  });
  describe('readPostAndCount', () => {
    it('조회 후 뷰 +1', async () => {
      const views = 11;
      mockedPostRepo.findOne.mockResolvedValueOnce({
        views,
        read: new Post().read,
      });
      const id = 1;
      const result = await postsService.readPostAndCount(id);
      expect(result.views).toBe(views + 1);
    });
  });

  describe('deletePost', () => {
    it('삭제 성공시 deletedAt는 truthy', async () => {
      const id = 2;
      const result = await postsService.deletePost(id);
      expect(result.id).toBe(id);
      expect(result.deletedAt).toBeTruthy();
    });
  });
  describe('getPostIdsWithImage', () => {
    it('존재시 postId 리스트를 반환한다', async () => {
      const mockedPostIds = [1, 2, 3];
      mockedFileRepo.find = () => Promise.resolve(mockedPostIds);
      const result = await postsService.getPostIdsWithImage();
      expect(result.length).toBe(mockedPostIds.length);
    });
  });
});
