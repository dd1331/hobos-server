import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from '../posts.service';
import { Repository } from 'typeorm';
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

describe('PostsService', () => {
  let postsService: PostsService;
  let mockedPostRepo;
  let mockedFileRepo;

  beforeEach(async () => {
    mockedPostRepo = {
      findOne: ({ where: { id } }): Promise<Partial<Post>> => {
        return Promise.resolve({ id, views: 0 });
      },
      findOneBy: ({ id }): Promise<Partial<Post>> => {
        return Promise.resolve({ id, views: 0 });
      },
      create: (dto: Partial<CreatePostDto>): Promise<Partial<Post>> => {
        return Promise.resolve({ ...dto });
      },
      save: (dto: Partial<Post>) => {
        return Promise.resolve({ ...dto });
      },
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
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        PostsService,
        HashtagsService,
        CommentsService,
        LikesService,
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
    }).compile();
    postsService = module.get<PostsService>(PostsService);
  });

  describe('readPostAndCount', () => {
    it('???????????? ?????? Post ??????', async () => {
      const id = 3;
      const result = await postsService.readPostAndCount(id);
      expect(result.id).toBe(id);
    });
    it('???????????? ?????? ?????? NotFoundException', async () => {
      mockedPostRepo.findOne = () => Promise.resolve(null);
      const result = async () => await postsService.readPostAndCount(111);
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
    it('????????? ?????? ??????', async () => {
      const result = await postsService.createPost(payload);
      expect(result).toEqual({ ...payload });
    });
    it('????????? ?????? ??????', async () => {
      mockedPostRepo.save = () => Promise.resolve(null);
      const result = async () => await postsService.createPost(payload);
      expect(result()).rejects.toThrow(BadRequestException);
    });
    it('dto??? fileId??? ???????????? ?????? post??? files??? ??????', async () => {
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
    it('?????? ????????? ???????????? ??????', async () => {
      const result = await postsService.updatePost(payload);
      expect(result.title).toBe(payload.title);
      expect(result.content).toBe(payload.content);
    });
    it('????????? ?????? ???????????? ??????', async () => {
      const fileId = 1;
      const payloadWithFileId: UpdatePostDto = { ...payload, fileId };
      const result = await postsService.updatePost(payloadWithFileId);

      expect(result.files.length).toBeGreaterThan(0);
    });
  });
  describe('readPostAndCount', () => {
    it('?????? ??? ??? +1', async () => {
      const views = 11;
      mockedPostRepo.findOne = (): Promise<Partial<Post>> =>
        Promise.resolve({ views });
      const id = 1;
      const result = await postsService.readPostAndCount(id);
      expect(result.views).toBe(views + 1);
    });
  });

  describe('deletePost', () => {
    it('?????? ????????? deletedAt??? truthy', async () => {
      const id = 2;
      const result = await postsService.deletePost(id);
      expect(result.id).toBe(id);
      expect(result.deletedAt).toBeTruthy();
    });
  });
  describe('getPostIdsWithImage', () => {
    it('????????? postId ???????????? ????????????', async () => {
      const mockedPostIds = [1, 2, 3];
      mockedFileRepo.find = () => Promise.resolve(mockedPostIds);
      const result = await postsService.getPostIdsWithImage();
      expect(result.length).toBe(mockedPostIds.length);
    });
  });
});
