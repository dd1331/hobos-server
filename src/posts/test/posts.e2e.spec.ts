import { INestApplication, HttpStatus } from '@nestjs/common';
import { AppModule } from '../../app.module';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { UsersService } from '../../users/users.service';
import { User } from '../../users/entities/user.entity';
import { CreatePostDto } from '../dto/create-post.dto';
import { PostsService } from '../posts.service';
import { Post } from '../entities/post.entity';
import { UpdatePostDto } from '../dto/update-post.dto';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { CreateLikeDto } from '../../like/dto/create-like-dto';
import { GetPostsDto } from '../dto/get-posts.dto';
import each from 'jest-each';
import * as dayjs from 'dayjs';
import { LikesService } from '../../like/likes.service';
let agent;
const createUserDto: CreateUserDto = {
  userId: 'testUserId',
  userName: 'testUserName',
  password: '123123',
  phone: '01000000002',
};
describe('Posts', () => {
  let app: INestApplication;
  let usersService: UsersService;
  let postsService: PostsService;
  let likesService: LikesService;
  let user: User;
  let post: Post;
  let createPostDto: CreatePostDto;
  let updatePostDto: UpdatePostDto;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    usersService = moduleRef.get<UsersService>(UsersService);
    postsService = moduleRef.get<PostsService>(PostsService);
    likesService = moduleRef.get<LikesService>(LikesService);

    app = moduleRef.createNestApplication();
    await app.init();
    agent = app.getHttpServer();
    user = await usersService.create(createUserDto);

    createPostDto = {
      poster: user.id.toString(),
      title: '트렌드 test',
      content: 'trend content 1',
      category: 'free',
      hashtags: ['해시태그 테스트1', 'test트렌드5'],
    };

    // TODO set createdAt for testing
    const createPostDtoArray = [
      createPostDto,
      {
        ...createPostDto,
        title: '검색용',
        category: 'excercise',
        hashtags: ['검색용1', '검색용2'],
      },
      {
        ...createPostDto,
        title: '검색용',
        category: 'excercise',
        hashtags: ['검색용1', '검색용2'],
      },
      { ...createPostDto, category: 'excercise' },
      { ...createPostDto, category: 'excercise' },
      { ...createPostDto, category: 'excercise' },
      { ...createPostDto, category: 'excercise' },
      { ...createPostDto, category: 'excercise' },
      { ...createPostDto, category: 'excercise' },
      { ...createPostDto, category: 'excercise' },
      { ...createPostDto, category: 'excercise' },
      { ...createPostDto, category: 'excercise' },
      { ...createPostDto, category: 'excercise' },
      { ...createPostDto, category: 'excercise' },
      { ...createPostDto, category: 'excercise' },
      { ...createPostDto, category: 'excercise' },
      { ...createPostDto, category: 'enviroment' },
      { ...createPostDto, category: 'enviroment' },
      { ...createPostDto, category: 'enviroment' },
      { ...createPostDto, category: 'enviroment' },
      { ...createPostDto, category: 'enviroment' },
      { ...createPostDto, category: 'enviroment' },
      { ...createPostDto, category: 'enviroment' },
      { ...createPostDto, category: 'enviroment' },
      { ...createPostDto, category: 'enviroment' },
      { ...createPostDto, category: 'enviroment' },
      { ...createPostDto, category: 'enviroment' },
      { ...createPostDto, category: 'enviroment' },
      { ...createPostDto, category: 'enviroment' },
      { ...createPostDto, category: 'enviroment' },
      { ...createPostDto, category: 'free' },
      { ...createPostDto, category: 'free' },
      { ...createPostDto, category: 'free' },
      { ...createPostDto, category: 'free' },
      { ...createPostDto, category: 'free' },
      { ...createPostDto, category: 'free' },
      { ...createPostDto, category: 'free' },
      { ...createPostDto, category: 'free' },
      { ...createPostDto, category: 'free' },
      { ...createPostDto, category: 'free' },
      { ...createPostDto, category: 'free' },
      { ...createPostDto, category: 'free' },
      { ...createPostDto, category: 'free' },
      { ...createPostDto, category: 'free' },
      { ...createPostDto, category: 'free' },
    ];
    await Promise.all(
      createPostDtoArray.map(async (item, index) => {
        post = await postsService.createPost(item);
        const createLikeDto: CreateLikeDto = {
          type: 'post',
          isLike: true,
          targetId: post.id,
          userId: user.id,
        };
        if (index < 3) {
          await likesService.likeOrDislike(createLikeDto, user);
        } else {
          await postsService.readPost(post.id);
        }
      }),
    );
    updatePostDto = {
      title: 'updated title',
      content: 'updated content',
      id: post.id,
      poster: user.id.toString(),
    };
  });
  afterAll(async () => {
    await app.close();
  });
  describe('/POST createPost', () => {
    it('created post with no extra ', async () => {
      delete createPostDto.hashtags;
      const { body } = await request(agent)
        .post('/posts/create')
        .send(createPostDto)
        .expect(HttpStatus.CREATED);
      expect(body).toMatchObject(createPostDto);
    });
    it('create post with file', async () => {
      delete createPostDto.hashtags;
      const dtoWithHashTag: CreatePostDto = {
        ...createPostDto,
        fileId:
          'https://movement-seoul.s3.ap-northeast-2.amazonaws.com/credit_button.png',
      };
      // TODO should i get created files and compare?
      const { body } = await request(agent)
        .post('/posts/create')
        .send(dtoWithHashTag)
        .expect(HttpStatus.CREATED);
      expect(body).toMatchObject(createPostDto);
      const createLikeDto: CreateLikeDto = {
        type: 'post',
        isLike: true,
        targetId: post.id,
        userId: user.id,
      };
      await likesService.likeOrDislike(createLikeDto, user);
    });
    it('create post with hashtags', async () => {
      const dtoWithHashTag: CreatePostDto = {
        ...createPostDto,
        hashtags: ['test트렌드1', 'test트렌드5'],
      };
      // TODO should i get created hashtags and compare?
      const { body } = await request(agent)
        .post('/posts/create')
        .send(dtoWithHashTag)
        .expect(HttpStatus.CREATED);
      expect(body).toMatchObject(createPostDto);
    });
    each([
      // [content, title, category, expected]
      ['', '', '', HttpStatus.BAD_REQUEST],
      ['test content', '', 'free', HttpStatus.BAD_REQUEST],
      ['', 'test title', 'free', HttpStatus.BAD_REQUEST],
      ['test1', 'test2', '', HttpStatus.BAD_REQUEST],
      ['valid title', 'valid content', 'free', HttpStatus.CREATED],
    ]).test(
      'should throw an error if has invalid value',
      async (content, title, category, expected) => {
        const invalidCreatePostDto: CreatePostDto = {
          poster: user.id.toString(),
          content,
          title,
          category,
        };
        await request(agent)
          .post('/posts/create')
          .send(invalidCreatePostDto)
          .expect(expected);
        // TODO check file size and hashtag validation
        // expect(body.message).toHaveLength(2); // title, content
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
      // TODO return bad request for negative integer and one exceeding maximum value,
      // seems like parseInt pipe is handling exceeding int value
      [-99999999, HttpStatus.NOT_FOUND],
      // [999999999999999999999, HttpStatus.NOT_FOUND],
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
      // [category, take, page, hashtagId]
      ['free', 2, 1, 3],
      ['excercise', 3, 1, 2],
      ['enviroment', 3, 1, 0],
    ];
    each(params).it(
      'should return post array',
      async (category, take, page, hashtagId) => {
        const dto: GetPostsDto = {
          category,
          take,
          page,
          hashtagId,
        };
        const { body } = await request(agent)
          .get('/posts')
          .query(dto)
          .expect(HttpStatus.OK);
        // TODO handle when existing data is less than take
        if (take) expect(body.length).toBeLessThanOrEqual(take);
        if (!take) expect(body.length).toBeLessThanOrEqual(20);
        // TODO find a way of checking page
        const categories = body.map((post) => post.category);
        expect(categories.every((cg) => cg === category)).toEqual(true);
      },
    );
  });

  describe('GET getPopularPosts', () => {
    it('should return popular posts', async () => {
      await postsService.readPost(post.id);
      const { body } = await request(agent).get('/posts/popular');
      const createdArr = body.map((post) => {
        return post.createdAt;
      });
      const viewsArr = body.map((post) => {
        return post.views;
      });
      const isWithinPeriod = createdArr.every((createdAt) => {
        return dayjs(createdAt).isAfter(dayjs().subtract(7, 'd'));
      });
      const sortedViews = viewsArr.map((views) => views).sort((a, b) => b - a);
      expect(isWithinPeriod).toBe(true);
      expect(sortedViews).toEqual(viewsArr);
      expect(viewsArr[0]).toEqual(body[0].views);
    });
  });

  describe('/GET getRecommendedPosts', () => {
    it('should return posts ordered by likes', async () => {
      const { body } = await request(agent).get('/posts/recommended');
      const createdArr = body.map((post) => post.createdAt);
      const isWithinPeriod = createdArr.every((createdAt) =>
        dayjs(createdAt).isAfter(dayjs().subtract(7, 'd')),
      );
      expect(isWithinPeriod).toBe(true);
      const likes = body.map((post) => post.likeCount);
      const sortedLikes = [...likes].sort((a, b) => b - a);
      expect(likes).toEqual(sortedLikes);
    });
  });
  describe('/PATCH updatePost', () => {
    // TODO set app context instead of sending poster
    it('should return updated post object', async () => {
      const { body } = await request(agent)
        .patch('/posts')
        .send(updatePostDto)
        .expect(HttpStatus.OK);
      expect({ ...body, poster: body.poster.id.toString() }).toMatchObject(
        updatePostDto,
      );
    });
    const params = [
      // [ postId, title, content, expected, httpStatus ]
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
        const invalidUpdatePostDto: UpdatePostDto = {
          ...updatePostDto,
          title,
          content,
        };
        if (postId) invalidUpdatePostDto.id = postId;
        const { body } = await request(agent)
          .patch('/posts')
          .send(invalidUpdatePostDto)
          .expect(httpStatus);
        if (httpStatus === HttpStatus.BAD_REQUEST)
          expect(body.message).toHaveLength(expected);
      },
    );
    it('should throw an error if the post is not existing', async () => {
      const invalidUpdatePostDto: UpdatePostDto = { ...updatePostDto };
      invalidUpdatePostDto.id = 99999;
      const { body } = await request(agent)
        .patch('/posts')
        .send(invalidUpdatePostDto)
        .expect(HttpStatus.NOT_FOUND);
      expect(body.message).toBe('존재하지 않는 게시글입니다');
    });
  });
  describe('/DELETE deletePost', () => {
    it('should return deleted post object', async () => {
      const { body } = await request(agent)
        .delete(`/posts/${post.id}`)
        .expect(HttpStatus.OK);
      expect(body).toBeTruthy();
    });
    const params = [
      // [ postId, httpStatus ]
      [99999, HttpStatus.NOT_FOUND],
      // TODO find out a way of returning bad request using pipe when negative value is sent
      [-33, HttpStatus.NOT_FOUND],
      ['test', HttpStatus.BAD_REQUEST],
    ];
    each(params).it(
      'should throw an erorr if post does not exist or already deleted',
      async (postId, httpStatus) => {
        const { body } = await request(agent)
          .delete(`/posts/${postId}`)
          .expect(httpStatus);
        expect(body.statusCode).toBe(httpStatus);
        if (httpStatus === HttpStatus.NOT_FOUND)
          expect(body.message).toBe('존재하지 않는 게시글입니다');
      },
    );
  });

  // moved to like test

  // describe('/POST likePost', () => {
  //   it('should return created like obejct', async () => {
  //     const createLikeDto: CreateLikeDto = {
  //       type: 'post',
  //       isLike: true,
  //       targetId: post.id,
  //       userId: user.id,
  //     };
  //     const { body } = await request(agent)
  //       .post('/posts/like')
  //       .send(createLikeDto);
  //     console.log(body);
  //   });
  // });
  // describe('/POST dislikePost', () => {
  //   it('should return created like obejct', async () => {
  //     const createLikeDto: CreateLikeDto = {
  //       type: 'post',
  //       isLike: false,
  //       targetId: 136,
  //       userId: 233,
  //     };
  //     const { body } = await request(agent)
  //       .post('/posts/dislike')
  //       .send(createLikeDto);
  //     console.log(body);
  //   });
  // });
});
