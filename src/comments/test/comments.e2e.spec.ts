import * as request from 'supertest';
import { INestApplication, HttpStatus } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../app.module';
import { CommentsService } from '../comments.service';
import { CreateCommentDto } from '../dto/create-comment-dto';
import { CreateChildCommentDto } from '../dto/create-child-comment-dto';
import { UsersService } from '../../users/users.service';
import { User } from '../../users/entities/user.entity';
import { CreatePostDto } from '../../posts/dto/create-post.dto';
import { Post } from '../../posts/entities/post.entity';
import { PostsService } from '../../posts/posts.service';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { Comment } from '../entities/comment.entity';
import { AuthService } from '../../auth/auth.service';
import { BulkedUser } from '../../users/users.type';

describe('Posts', () => {
  let app: INestApplication;
  let commentsService: CommentsService;
  let createdComment: Comment;
  let usersService: UsersService;
  let postsService: PostsService;
  let authService: AuthService;
  let user: User;
  let post: Post;
  let accessToken: string;
  const createUserDto: CreateUserDto = {
    userId: 'testUserId',
    userName: 'testUserName',
    password: '123123',
    phone: '01000000002',
  };
  let createCommentDto: CreateCommentDto;
  let createPostDto: CreatePostDto;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    usersService = moduleRef.get<UsersService>(UsersService);
    postsService = moduleRef.get<PostsService>(PostsService);
    authService = moduleRef.get<AuthService>(AuthService);
    commentsService = moduleRef.get<CommentsService>(CommentsService);
    user = await usersService.create(createUserDto);
    createPostDto = {
      poster: user.id.toString(),
      title: '트렌드 test',
      content: 'trend content 1',
      category: 'free',
      hashtags: ['해시태그 테스트1', 'test트렌드5'],
    };
    const bulkedUser: BulkedUser = await authService.login(user);
    accessToken = bulkedUser.accessToken;
    post = await postsService.createPost(createPostDto);
    createCommentDto = {
      content: 'new content',
      commenterId: user.id,
      postId: post.id,
    };
    createdComment = await commentsService.createComment(
      createCommentDto,
      user,
    );
    app = moduleRef.createNestApplication();
    await app.init();
  });
  afterAll(async () => {
    await app.close();
  });
  beforeEach(async () => {});
  describe('CREATE', () => {
    it('create a comment and get comment object', async () => {
      // const comment = await commentsService.createComment(createCommentDto);
      const { body } = await request(app.getHttpServer())
        .post('/comments/create')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(createCommentDto)
        .expect(HttpStatus.CREATED);
      expect(body.content).toBe(createCommentDto.content);
      // createdComment = body;
    });
  });
  describe('CREATE childComment', () => {
    it('create childComment', async () => {
      const createChildCommentDto: CreateChildCommentDto = {
        postId: post.id,
        commenterId: user.id,
        content: 'child98',
        parentId: createdComment.id,
      };
      const res = await request(app.getHttpServer())
        .post('/comments/create-child')
        .send(createChildCommentDto);
      // await commentsService.createChildComment(createChildCommentDto);
    });
  });
});
