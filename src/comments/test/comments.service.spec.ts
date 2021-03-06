import { Test, TestingModule } from '@nestjs/testing';
import { Comment } from '../entities/comment.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateCommentDto } from '../dto/create-comment-dto';
import { Post } from '../../posts/entities/post.entity';
import { PostsService } from '../../posts/posts.service';
import { CommentsService } from '../comments.service';
import { UpdateCommentDto } from '../dto/update-comment-dto';
import { File } from '../../files/entities/file.entity';
import { ChildComment } from '../entities/child_comment.entity';
import { RecommendedPost } from '../../posts/entities/recommended_post.entity';
import { HashtagsService } from '../../hashtags/hashtags.service';
import { Hashtag } from '../../hashtags/entities/hashtag.entity';
import { PostHashtag } from '../../posts/entities/post_hashtag.entity';
import { CreatePostDto } from '../../posts/dto/create-post.dto';
import { User, RoleEnum, ProviderEnum } from '../../users/entities/user.entity';
import { Like } from '../../like/entities/like.entity';
import { CreateChildCommentDto } from '../dto/create-child-comment-dto';
import { NotFoundException } from '@nestjs/common';
import { Review } from '../../locals/entities/review.entity';

describe('CommentsService', () => {
  let commentsService: CommentsService;
  const user: User = {
    userId: '',
    naverId: '',
    googleId: '',
    userName: '',
    password: '',
    phone: '',
    role: RoleEnum.USER,
    provider: ProviderEnum.LOCAL,
    avatar: '',
    posts: [new Post()],
    comments: [new Comment()],
    childComments: [new ChildComment()],
    likes: [new Like()],
    id: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    reviews: [new Review()],
  };

  let mockedPostRepo;
  let mockedCommentRepo;
  let mockedFileRepo;
  let mockedChildCommentRepo;
  beforeEach(async () => {
    mockedPostRepo = {
      findOne: (id): Promise<Partial<Post>> => {
        return Promise.resolve({ id, views: 0 });
      },
      create: (dto: Partial<CreatePostDto>): Promise<Partial<Post>> => {
        return Promise.resolve({ id: Date.now().valueOf(), ...dto });
      },
      save: (dto: Partial<Post>) => {
        return Promise.resolve({ ...dto });
      },
    };
    mockedCommentRepo = {
      create: (dto: Partial<CreateCommentDto>): Promise<Partial<Comment>> => {
        return Promise.resolve({ ...dto });
      },
      save: (dto: Partial<CreateCommentDto>): Promise<Partial<Comment>> => {
        return Promise.resolve({ postId: dto.postId, content: dto.content });
      },
      findOne: (id): Promise<Partial<Comment>> => {
        return Promise.resolve({ id, childCount: 0 });
      },
      findOneBy: ({ id }): Promise<Partial<Comment>> => {
        return Promise.resolve({ id, childCount: 0 });
      },
      find: (): Promise<Partial<Comment>[]> => {
        return Promise.resolve([]);
      },
      count: (): Promise<number> => {
        return Promise.resolve(0);
      },
    };
    mockedFileRepo = {};
    mockedChildCommentRepo = {
      create: (
        dto: Partial<CreateChildCommentDto>,
      ): Promise<Partial<ChildComment>> => {
        return Promise.resolve({
          content: dto.content,
          postId: dto.postId,
          parentId: dto.parentId,
        });
      },
      save: (): Promise<Partial<ChildComment>> => {
        return Promise.resolve({});
      },
      findOne: (id): Promise<Partial<ChildComment>> => {
        return Promise.resolve({ id });
      },
      findOneBy: ({ id }): Promise<Partial<ChildComment>> => {
        return Promise.resolve({ id });
      },
      count: (): Promise<number> => {
        return Promise.resolve(0);
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        CommentsService,
        HashtagsService,
        { provide: getRepositoryToken(Post), useValue: mockedPostRepo },
        { provide: getRepositoryToken(RecommendedPost), useValue: {} },
        { provide: getRepositoryToken(File), useValue: mockedFileRepo },
        { provide: getRepositoryToken(Comment), useValue: mockedCommentRepo },
        { provide: getRepositoryToken(Hashtag), useValue: {} },
        { provide: getRepositoryToken(PostHashtag), useValue: {} },
        {
          provide: getRepositoryToken(ChildComment),
          useValue: mockedChildCommentRepo,
        },
      ],
    }).compile();

    commentsService = module.get<CommentsService>(CommentsService);
  });
  beforeEach(async () => {});
  describe('createComment', () => {
    const payload: CreateCommentDto = { postId: 3, content: 'test content' };

    it('?????? ?????? ??????', async () => {
      const result = await commentsService.createComment(payload, user);

      expect(result.commenter.id).toBe(user.id);
      expect(result.content).toBe(payload.content);
      expect(result.postId).toBe(payload.postId);
    });
  });
  describe('createChildComment', () => {
    const payload: CreateChildCommentDto = {
      parentId: 1,
      postId: 2,
      content: '',
    };
    it('????????? ?????? ??????', async () => {
      const result = await commentsService.createChildComment(payload, user);
      expect(result.commenter.id).toBe(user.id);
      expect(result.content).toBe(payload.content);
      expect(result.parentId).toBe(payload.parentId);
      expect(result.postId).toBe(payload.postId);
    });
    it('?????? ????????? ???????????? ?????? ?????? ??????', async () => {
      mockedCommentRepo.findOneBy = () => Promise.resolve(null);
      const result = async () =>
        await commentsService.createChildComment(payload, user);
      expect(result()).rejects.toThrowError(NotFoundException);
    });
    it('???????????? ???????????? ?????? ?????? ??????', async () => {
      mockedPostRepo.findOne = () => Promise.resolve(null);
      const result = async () =>
        await commentsService.createChildComment(payload, user);
      expect(result()).rejects.toThrowError(NotFoundException);
    });
  });
  describe('getActiveComments', () => {
    const postId = 2;
    it('????????? ?????? ???????????? ??????', async () => {
      mockedCommentRepo.find = (option) =>
        Promise.resolve([{ postId: option.where.postId }]);
      const result = await commentsService.getActiveComments(postId);
      result.forEach((post) => {
        expect(post.postId).toBe(postId);
      });
    });
    it('???????????? ????????? ???????????? ?????? ?????? NotFoundException', async () => {
      mockedCommentRepo.find = () => Promise.resolve(null);
      const result = async () =>
        await commentsService.getActiveComments(postId);
      // TODO specify Error
      expect(result()).rejects.toThrow();
    });
  });
  describe('getChildComment', () => {
    const childCommentId = 2;
    it('????????? ???????????? ??????', async () => {
      mockedChildCommentRepo.findOneBy = ({
        id,
      }): Promise<Partial<ChildComment>> => Promise.resolve({ id });
      const result = await commentsService.getChildComment(childCommentId);
      expect(result.id).toBe(childCommentId);
    });
    it('???????????? ????????? ???????????? ?????? ?????? NotFoundException', async () => {
      mockedChildCommentRepo.findOneBy = () => Promise.resolve(null);
      const result = async () =>
        await commentsService.getChildComment(childCommentId);

      expect(result()).rejects.toThrowError(NotFoundException);
    });
  });
  describe('updateComment', () => {
    const id = 3;
    const dto: UpdateCommentDto = { id, content: 'updated' };
    it('???????????? ??????', async () => {
      // mockedCommentRepo.findOne = (): Promise<Partial<Comment>> =>
      //   Promise.resolve();
      mockedCommentRepo.save = (
        dto: Partial<UpdateCommentDto>,
      ): Promise<Partial<Comment>> => Promise.resolve(dto);
      const result = await commentsService.updateComment(dto);
      console.log(
        '???? ~ file: comments.service.spec.ts ~ line 201 ~ it ~ result',
        result,
      );

      expect(result.content).toBe(dto.content);
      expect(result.id).toBe(id);
    });
    it('????????? ???????????? ?????? ?????? NotFoundException', async () => {
      mockedCommentRepo.findOneBy = () => Promise.resolve(null);

      const result = async () => await commentsService.updateComment(dto);

      expect(result()).rejects.toThrowError(NotFoundException);
    });
  });
  describe('getCommentOrFail', () => {
    const id = 3;
    it('?????? ???????????? ??????', async () => {
      const result = await commentsService.getCommentOrFail(id);
      expect(result.id).toBe(id);
    });
    it('????????? ???????????? ?????? ?????? NotFoundException', async () => {
      mockedCommentRepo.findOneBy = () => Promise.resolve(null);

      const result = async () => await commentsService.getCommentOrFail(id);

      expect(result()).rejects.toThrowError(NotFoundException);
    });
  });
  describe('deleteComment', () => {
    const id = 3;
    it('?????? ????????? deletedAt??? truthy', async () => {
      const result = await commentsService.deleteComment(id);

      expect(result.id).toBe(id);
      expect(result.deletedAt).toBeTruthy();
    });
    it('????????? ???????????? ?????? ?????? NotFoundException', async () => {
      mockedCommentRepo.findOneBy = () => Promise.resolve(null);

      const result = async () => await commentsService.getCommentOrFail(id);

      expect(result()).rejects.toThrowError(NotFoundException);
    });
  });
  describe('deleteChildComment', () => {
    const id = 3;
    it('????????? ????????? deletedAt??? truthy', async () => {
      const childCount = 10;

      mockedCommentRepo.findOne = () => Promise.resolve({ id, childCount });

      const result = await commentsService.deleteChildComment(id);

      expect(result.id).toBe(id);
      expect(result.childCount).toBe(childCount - 1);
      expect(result.deletedAt).toBeTruthy();
    });
    it('????????? ???????????? ?????? ?????? NotFoundException', async () => {
      mockedChildCommentRepo.findOneBy = () => Promise.resolve(null);

      const result = async () => await commentsService.deleteChildComment(id);

      expect(result()).rejects.toThrowError(NotFoundException);
    });
  });

  describe('getCommentSumByUserId', () => {
    const commentCount = 120;
    const childCommentCount = 12;
    it('????????? ????????? ????????? ????????????', async () => {
      mockedCommentRepo.count = () => Promise.resolve(commentCount);
      mockedChildCommentRepo.count = () => Promise.resolve(childCommentCount);

      const result = await commentsService.getCommentSumByUserId(3);
      expect(result).toBe(commentCount + childCommentCount);
    });
    it('????????? ????????? ???????????? ?????? ?????? 0??? ??????', async () => {
      const result = await commentsService.getCommentSumByUserId(3);
      expect(result).toBe(0);
    });
  });
});
