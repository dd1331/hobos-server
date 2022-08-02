import * as request from 'supertest';
import { INestApplication, HttpStatus } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../app.module';
import { CommentsService } from '../comments.service';
import { CreateChildCommentDto } from '../dto/create-child-comment-dto';
import { UsersService } from '../../users/users.service';
import { User } from '../../users/entities/user.entity';
import { Post } from '../../posts/entities/post.entity';
import { PostsService } from '../../posts/posts.service';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { Comment } from '../entities/comment.entity';
import { AuthService } from '../../auth/auth.service';
import { BulkedUser } from '../../users/users.type';
import { CreatePostDto } from '../../posts/dto/create-post.dto';

describe('Comments', () => {
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
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    usersService = moduleRef.get<UsersService>(UsersService);
    postsService = moduleRef.get<PostsService>(PostsService);
    authService = moduleRef.get<AuthService>(AuthService);
    commentsService = moduleRef.get<CommentsService>(CommentsService);
    user = await usersService.create(createUserDto);

    const bulkedUser: BulkedUser = await authService.login(user);
    accessToken = bulkedUser.accessToken;
    post = await createPost();

    createdComment = await createComment();
    app = moduleRef.createNestApplication();
    await app.init();
  });
  afterAll(async () => {
    await app.close();
  });
  describe('CREATE', () => {
    it('create a comment and get comment object', async () => {
      const createCommentDto = {
        content: 'new content',
        commenterId: user.id,
        postId: post.id,
      };
      const { body } = await request(app.getHttpServer())
        .post('/comments/create')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(createCommentDto)
        .expect(HttpStatus.CREATED);
      expect(body.content).toBe(createCommentDto.content);
    });
  });
  describe('CREATE childComment', () => {
    it('create childComment', async () => {
      const createdComment = await createComment();
      const createChildCommentDto: CreateChildCommentDto = {
        postId: post.id,
        content: 'child98',
        parentId: createdComment.id,
      };
      const { body } = await request(app.getHttpServer())
        .post('/comments/create-child')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(createChildCommentDto);
      expect(body.parentId).toBe(createdComment.id);
    });
  });
  function createComment() {
    const createCommentDto = {
      content: 'new content',
      commenterId: user.id,
      postId: post.id,
    };
    return commentsService.createComment(createCommentDto, user);
  }
  function createPost(): Post | PromiseLike<Post> {
    const createPostDto: CreatePostDto = {
      poster: user.id,
      title: '트렌드 test',
      content: 'trend content 1',
      category: 'free',
      hashtags: ['aaas', 'test트렌드5'],
    };
    return postsService.createPost(createPostDto);
  }
});
