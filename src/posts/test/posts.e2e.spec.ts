import { INestApplication, HttpStatus } from '@nestjs/common';
import { AppModule } from '../../app.module';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { UsersService } from '../../users/users.service';
import { User } from '../../users/entities/user.entity';
import { CreatePostDto } from '../dto/create-post.dto';
import { PostsService } from '../posts.service';
import { Post, PostCategory } from '../entities/post.entity';
import { UpdatePostDto } from '../dto/update-post.dto';
import { CreateLikeDto } from '../../like/dto/create-like-dto';
import { GetPostsDto } from '../dto/get-posts.dto';
import each from 'jest-each';
import * as dayjs from 'dayjs';
import { LikesService } from '../../like/likes.service';
import { AuthService } from '../../auth/auth.service';
import { FilesService, UploadFileDto } from '../../files/files.service';
import { readFile } from 'fs/promises';
let agent;
describe('Posts', () => {
  let filesService: FilesService;
  let postsService: PostsService;
  let user: User;
  let post: Post;
  let SampleCreatePostDto: CreatePostDto;
  let accessToken: string;
  let createPost;
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const usersService = moduleRef.get<UsersService>(UsersService);
    const likesService = moduleRef.get<LikesService>(LikesService);
    const authService = moduleRef.get<AuthService>(AuthService);
    postsService = moduleRef.get<PostsService>(PostsService);
    filesService = moduleRef.get<FilesService>(FilesService);
    createPost = async (category: PostCategory) => {
      return await postsService.createPost({
        title: 'test',
        content: 'fff',
        poster: user.id,
        category: category || 'free',
      });
    };

    app = moduleRef.createNestApplication();
    await app.init();
    agent = app.getHttpServer();
    user = await getSampleUser(user, usersService);
    accessToken = await (await authService.login(user)).accessToken;

    SampleCreatePostDto = getSampleCreatePostDto(SampleCreatePostDto, user);

    // TODO set createdAt for testing
    post = await createLikedPosts(
      SampleCreatePostDto,
      post,
      postsService,
      user,
      likesService,
    );
  });
  afterAll(async () => {
    await app.close();
  });
  describe('/POST createPost', () => {
    it('created post with no extra ', async () => {
      const { hashtags, ...simpleCreatePostDto } = SampleCreatePostDto;
      const { body } = await request(agent)
        .post('/posts/create')
        .send(simpleCreatePostDto)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.CREATED);
      expect(body.title).toBe(SampleCreatePostDto.title);
      expect(body.content).toBe(SampleCreatePostDto.content);
    });
    it('create post with file', async () => {
      const buffer = await readFile('./package.json');

      const fileDto: UploadFileDto = {
        buffer,
        originalname: '',
        size: 3,
        mimetype: '',
      };
      const { id } = await filesService.uploadPostFile(fileDto);

      const fileId = id;
      const dtoWittFile: CreatePostDto = {
        ...SampleCreatePostDto,
        fileId,
      };
      // TODO should i get created files and compare?
      const { body } = await request(agent)
        .post('/posts/create')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(dtoWittFile)
        .expect(HttpStatus.CREATED);
      expect(body.files.pop().id).toBe(fileId);
    });
    it('create post with hashtags', async () => {
      const hashtags = ['test트렌드1', 'test트렌드5'];
      const dtoWithHashTag: CreatePostDto = {
        ...SampleCreatePostDto,
        hashtags,
      };
      // TODO should i get created hashtags and compare?
      const { body } = await request(agent)
        .post('/posts/create')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(dtoWithHashTag)
        .expect(HttpStatus.CREATED);
    });
    each([
      ['', '', '', 3],
      ['test content', '', 'free', 1],
      ['', 'test title', 'free', 1],
      ['test1', 'test2', '', 1],
    ]).test(
      'should throw an error if has invalid value',
      async (content, title, category, expectedErrorCount) => {
        const invalidCreatePostDto: CreatePostDto = {
          poster: user.id,
          content,
          title,
          category,
        };
        const { body } = await request(agent)
          .post('/posts/create')
          .set('Authorization', `Bearer ${accessToken}`)
          .send(invalidCreatePostDto)
          .expect(HttpStatus.BAD_REQUEST);
        // TODO check file size and hashtag validation
        expect(body.message).toHaveLength(expectedErrorCount);
      },
    );
  });
  describe('/GET getPost', () => {
    const params = [
      [1, HttpStatus.OK],
      ['1', HttpStatus.OK],
      ['das', HttpStatus.BAD_REQUEST],
      [null, HttpStatus.BAD_REQUEST],
      [99999999, HttpStatus.NOT_FOUND],
      [-99999999, HttpStatus.NOT_FOUND],
      // TODO return bad request for negative integer and one exceeding maximum value,
      // seems like parseInt pipe is handling exceeding int value
      // [9999999999999999999999, HttpStatus.NOT_FOUND],
    ];
    each(params).it('validate get post param', async (postId, expected) => {
      const { body } = await request(agent)
        .get(`/posts/${postId}`)
        .expect(expected);
      expect(body.deletedAt).toBeFalsy();
    });
  });
  describe('/GET getPosts', () => {
    const params = [
      ['free', 2, 1],
      ['exercise', 3, 1],
      ['environment', 3, 1],
    ];
    each(params).it(
      'should return post array',
      async (category, take, page) => {
        await createSamplePost(category, postsService, user);
        await createSamplePost(category, postsService, user);
        await createSamplePost(category, postsService, user);
        await createSamplePost(category, postsService, user);
        await createSamplePost(category, postsService, user);
        const dto: GetPostsDto = {
          category,
          take,
          page,
        };
        const { body } = await request(agent)
          .get('/posts')
          .query(dto)
          .expect(HttpStatus.OK);
        // TODO handle when existing data is less than take
        if (take) expect(body.length).toBeLessThanOrEqual(take);
        if (!take) expect(body.length).toBeLessThanOrEqual(20);
        // TODO find a way of checking page
        const hasSameCategory = body.every(
          (post) => post.category === category,
        );
        expect(hasSameCategory).toBeTruthy();
      },
    );
  });

  describe('GET getPopularPosts', () => {
    it('should return popular posts', async () => {
      await postsService.readPostAndCount(post.id);
      const { body } = await request(agent).get('/posts/popular');
      const createdArr = body.map((post) => post.createdAt);
      const viewsArr = body.map((post) => post.views);
      const isWithinPeriod = createdArr.every((createdAt) =>
        dayjs(createdAt).isAfter(dayjs().subtract(7, 'd')),
      );
      const sortedViews = viewsArr.sort((a, b) => b - a);
      expect(isWithinPeriod).toBeTruthy();
      expect(sortedViews).toEqual(viewsArr);
    });
  });

  describe('/GET getRecommendedPosts', () => {
    it('should return posts ordered by likes', async () => {
      const { body } = await request(agent).get('/posts/recommended');
      const createdArr = body.map((post) => post.createdAt);
      const isWithinPeriod = createdArr.every((createdAt) =>
        dayjs(createdAt).isAfter(dayjs().subtract(7, 'd')),
      );
      expect(isWithinPeriod).toBeTruthy();
      const likes = body.map((post) => post.likeCount);
      const sortedLikes = likes.sort((a, b) => b - a);
      expect(likes).toEqual(sortedLikes);
    });
  });
  describe('/PATCH updatePost', () => {
    // TODO set app context instead of sending poster
    it('should return updated post object', async () => {
      const updatePostDto = getUpdatePostDto(post, user);
      const { body } = await request(agent)
        .patch('/posts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updatePostDto)
        .expect(HttpStatus.OK);
      expect(body.id).toBe(updatePostDto.id);
      expect(body.title).toBe(updatePostDto.title);
      expect(body.content).toBe(updatePostDto.content);
    });
    const params = [
      [null, '', '', 2, HttpStatus.BAD_REQUEST],
      [null, 'valid title', '', 1, HttpStatus.BAD_REQUEST],
      [null, '', 'valid content', 1, HttpStatus.BAD_REQUEST],
      [null, 'valid title', 'valid content', 0, HttpStatus.OK],
      [99999999, 'valid title', 'valid content', 0, HttpStatus.NOT_FOUND],
    ];
    // TODO is it better to seperate not found test?
    each(params).it(
      'should throw an error if data is not valid',
      async (postId, title, content, expected, httpStatus) => {
        const updatePostDto = getUpdatePostDto(post, user);
        const invalidUpdatePostDto: UpdatePostDto = {
          ...updatePostDto,
          title,
          content,
        };

        if (postId) invalidUpdatePostDto.id = postId;

        const { body } = await request(agent)
          .patch('/posts')
          .set('Authorization', `Bearer ${accessToken}`)
          .send(invalidUpdatePostDto)
          .expect(httpStatus);

        if (httpStatus === HttpStatus.BAD_REQUEST)
          expect(body.message).toHaveLength(expected);
      },
    );
    it('should throw an error if the post is not existing', async () => {
      const invalidUpdatePostDto: UpdatePostDto = {
        ...getUpdatePostDto(post, user),
      };
      invalidUpdatePostDto.id = 99999999;
      const { body } = await request(agent)
        .patch('/posts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(invalidUpdatePostDto)
        .expect(HttpStatus.NOT_FOUND);
      expect(body.message).toBe('존재하지 않는 게시글입니다');
    });
  });
  describe('/DELETE deletePost', () => {
    it('should return deleted post object', async () => {
      const { body } = await request(agent)
        .delete(`/posts/${post.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.OK);
      expect(body.id).toBe(post.id);
      expect(body.deletedAt).toBeTruthy();
    });
    const params = [
      [99999, HttpStatus.NOT_FOUND],
      // TODO find out a way of returning bad request using pipe when negative value is sent
      [-33, HttpStatus.NOT_FOUND],
      ['test', HttpStatus.BAD_REQUEST],
      [null, HttpStatus.BAD_REQUEST],
      [undefined, HttpStatus.BAD_REQUEST],
    ];
    each(params).it(
      'should throw an erorr if post does not exist or already deleted',
      async (postId, httpStatus) => {
        const { body } = await request(agent)
          .delete(`/posts/${postId}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(httpStatus);
        expect(body.statusCode).toBe(httpStatus);
        if (httpStatus === HttpStatus.NOT_FOUND)
          expect(body.message).toBe('존재하지 않는 게시글입니다');
      },
    );
  });

  // move to like test
  describe('/POST likePost', () => {
    it('should return created like obejct', async () => {
      const post = await createPost();
      const createLikeDto: CreateLikeDto = {
        type: 'post',
        isLike: true,
        targetId: post.id,
        userId: user.id,
      };
      const { body } = await request(agent)
        .post('/posts/like')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(createLikeDto)
        .expect(HttpStatus.CREATED);
      expect(body.length).toBeGreaterThan(0);
    });
  });
  describe('/POST dislikePost', () => {
    it('should return created like obejct', async () => {
      const post = await createPost();
      const createLikeDto: CreateLikeDto = {
        type: 'post',
        isLike: false,
        targetId: post.id,
        userId: user.id,
      };
      const { body } = await request(agent)
        .post('/posts/dislike')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(createLikeDto)
        .expect(HttpStatus.CREATED);
      expect(body.length).toBeGreaterThan(0);
    });
  });
});
function getUpdatePostDto(post: Post, user: User): UpdatePostDto {
  return {
    title: 'updated title',
    content: 'updated content',
    id: post.id,
    poster: user.id,
  };
}

function getSampleCreatePostDto(
  SampleCreatePostDto: CreatePostDto,
  user: User,
) {
  SampleCreatePostDto = {
    poster: user.id,
    title: 'test title',
    content: 'test content',
    category: 'free',
    hashtags: ['해시태그 테스트1', '해시태그 테스트2'],
  };
  return SampleCreatePostDto;
}

async function createLikedPosts(
  SampleCreatePostDto: CreatePostDto,
  post: Post,
  postsService: PostsService,
  user: User,
  likesService: LikesService,
) {
  const createPostDtoArray: CreatePostDto[] = [
    SampleCreatePostDto,
    { ...SampleCreatePostDto, category: 'exercise' },
    { ...SampleCreatePostDto, category: 'environment' },
    { ...SampleCreatePostDto, category: 'free' },
  ];
  await Promise.all(
    createPostDtoArray.map(async (item, index) => {
      post = await postsService.createPost(item);
      const createLikeDto: CreateLikeDto = getCreateLikeDto(post, user);
      if (index < 3) await likesService.likeOrDislike(createLikeDto, user);
      else await postsService.readPostAndCount(post.id);
    }),
  );
  return post;
}

function getCreateLikeDto(post: Post, user: User): CreateLikeDto {
  return {
    type: 'post',
    isLike: true,
    targetId: post.id,
    userId: user.id,
  };
}

async function getSampleUser(user: User, usersService: UsersService) {
  user = await usersService.create({
    userId: 'testUserId',
    userName: 'testUserName',
    password: '123123',
    phone: '01000000002',
  });
  return user;
}
async function createSamplePost(
  category: PostCategory,
  postsService: PostsService,
  user: User,
) {
  return await postsService.createPost({
    title: 'test',
    content: 'fff',
    poster: user.id,
    category: category || 'free',
  });
}
