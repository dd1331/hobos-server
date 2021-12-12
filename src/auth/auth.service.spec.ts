import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { UsersService } from '../users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { PostsService } from '../posts/posts.service';
import { CommentsService } from '../comments/comments.service';
import { LikesService } from '../like/likes.service';
import { jwtConstants } from './constants';
import { Post } from '../posts/entities/post.entity';
import { File as FileEntity } from '../files/entities/file.entity';
import { RecommendedPost } from '../posts/entities/recommended_post.entity';
import { HashtagsService } from '../hashtags/hashtags.service';
import { Comment } from '../comments/entities/comment.entity';
import { ChildComment } from '../comments/entities/child_comment.entity';
import { Hashtag } from '../hashtags/entities/hashtag.entity';
import { PostHashtag } from '../posts/entities/post_hashtag.entity';
import { Like } from '../like/entities/like.entity';

import * as bcript from 'bcryptjs';

describe('Auth', () => {
  let authService: AuthService;

  const mockedUsersService: { getUserByPhone: any } = { getUserByPhone: null };
  beforeEach(() => {
    mockedUsersService.getUserByPhone = async (phone) => {
      const password = await bcript.hash('123456789', 12);
      return { phone, password };
    };
  });

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: jwtConstants.secret,
          signOptions: { expiresIn: '60h' },
        }),
      ],
      providers: [
        AuthService,
        UsersService,
        PostsService,
        CommentsService,
        HashtagsService,
        LikesService,
        {
          provide: getRepositoryToken(User),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Post),
          useValue: {},
        },
        {
          provide: getRepositoryToken(FileEntity),
          useValue: {},
        },
        {
          provide: getRepositoryToken(RecommendedPost),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Comment),
          useValue: {},
        },
        {
          provide: getRepositoryToken(ChildComment),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Hashtag),
          useValue: {},
        },
        {
          provide: getRepositoryToken(PostHashtag),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Like),
          useValue: {},
        },
      ],
    })
      .overrideProvider(UsersService)
      .useValue(mockedUsersService)
      .compile();
    authService = moduleRef.get<AuthService>(AuthService);
  });
  describe('Login', () => {
    it('JWT 로그인 성공', async () => {
      const id = Date.now();
      const user = new User();
      user.id = id;
      const result = await authService.login(user);
      expect(result).toEqual({ id, accessToken: expect.any(String) });
    });
  });
  describe('로컬 로그인 유효성 체크', () => {
    const phoneInput = '01099999999';
    const passwordInput = '123456789';
    it('로컬 유저 유효성체크 성공', async () => {
      const result = await authService.validateLocalUser(
        phoneInput,
        passwordInput,
      );
      expect(result).toEqual({
        phone: phoneInput,
        password: expect.any(String),
      });
    });
    it('로컬 유저 유효성체크 비밀번호 불일치', async () => {
      const wrongPasswordInput = '1234';
      const result = async () =>
        await authService.validateLocalUser(phoneInput, wrongPasswordInput);
      expect(result()).rejects.toThrowError(NotFoundException);
    });
    it('로컬 유저 유효성체크 전화번호 없음', async () => {
      mockedUsersService.getUserByPhone = () => Promise.resolve(null);
      const result = async () =>
        await authService.validateLocalUser(phoneInput, passwordInput);
      expect(result()).rejects.toThrowError(NotFoundException);
    });
  });
});
