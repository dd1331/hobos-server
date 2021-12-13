import { Test, TestingModule } from '@nestjs/testing';
import { Repository, BaseEntity } from 'typeorm';
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
import { CommonEntity } from '../../common.entity';
import { UsersService, UsersService } from '../../users/users.service';
import { RoomLog } from '../../matcher/room_log.entity';
import { Like } from '../../like/entities/like.entity';
import { Chat } from '../../matcher/chat.entity';

describe('CommentsService', () => {
  let commentsService: CommentsService;
  let commentRepo: Repository<Comment>;
  let postRepo: Repository<Post>;
  let createCommentDto: CreateCommentDto;
  let createdComment: Partial<Comment>;
  let updateCommentDto: UpdateCommentDto;
  let post: Partial<Post>;
  let postsService: PostsService;
  let comments: Partial<Comment>[];

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
    };
    mockedFileRepo = {};
    mockedChildCommentRepo = {};
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

    // postsService = module.get<PostsService>(PostsService);
    // postRepo = module.get<Repository<Post>>(getRepositoryToken(Post));
    commentsService = module.get<CommentsService>(CommentsService);
    // commentRepo = module.get<Repository<Comment>>(getRepositoryToken(Comment));
  });
  beforeEach(async () => {});
  describe('createComment', () => {
    const payload: CreateCommentDto = { postId: 3, content: 'test content' };
    it('댓글 생성 성공', async () => {
      const commenterId = 2;
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
        roomLog: [new RoomLog()],
        likes: [new Like()],
        chat: [new Chat()],
        id: commenterId,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };
      const result = await commentsService.createComment(payload, user);

      expect(result.commenter.id).toBe(commenterId);
      expect(result.content).toBe(payload.content);
      expect(result.postId).toBe(payload.postId);
    });
  });
});
