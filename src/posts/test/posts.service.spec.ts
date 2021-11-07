// import { Test, TestingModule } from '@nestjs/testing';
// import { PostsService } from '../posts.service';
// import { Repository } from 'typeorm';
// import { getRepositoryToken } from '@nestjs/typeorm';
// import { Post } from '../entities/post.entity';
// import { HttpStatus, CACHE_MANAGER } from '@nestjs/common';
// import { Like } from '../../like/entities/like.entity';
// import { CreateLikeDto } from '../../like/dto/create-like-dto';
// import { CreatePostDto } from '../dto/create-post.dto';
// import { File } from '../../files/entities/file.entity';
// import { UsersService } from '../../users/users.service';
// import { User } from '../../users/entities/user.entity';
// import { CacheService } from '../../cache/cache.service';
// import { HashtagsService } from '../../hashtags/hashtags.service';
// import { Hashtag } from '../../hashtags/entities/hashtag.entity';
// import { PostHashtag } from '../entities/post_hashtag.entity';
// const newPosts = [
//   {
//     id: 1,
//     poster: 3,
//     title: 'test title 1',
//     content: 'test content 1',
//     like: 0,
//     dislike: 0,
//     views: 0,
//     deletedAt: null,
//   },
//   {
//     id: 2,
//     poster: 3,
//     title: 'test title 2',
//     content: 'test content 2',
//     like: 0,
//     dislike: 0,
//     views: 0,
//     deletedAt: new Date(),
//   },
//   {
//     id: 3,
//     poster: 3,
//     title: 'test title 3',
//     content: 'test content 3',
//     like: 0,
//     dislike: 0,
//     views: 0,
//     deletedAt: null,
//   },
//   {
//     id: 4,
//     poster: 3,
//     title: 'test title 4',
//     content: 'test content 4',
//     like: 0,
//     dislike: 0,
//     views: 0,
//     deletedAt: null,
//   },
// ];
// const createPostDto: CreatePostDto = {
//   poster: '3',
//   title: 'test title 1',
//   content: 'test content 1',
//   category: 'board',
// };

describe('PostsService', () => {
  it('', () => {
    return;
  });
  //   let service: PostsService;
  //   let repo: Repository<Post>;

  //   beforeEach(async () => {
  //     const module: TestingModule = await Test.createTestingModule({
  //       providers: [
  //         UsersService,
  //         PostsService,
  //         HashtagsService,
  //         CacheService,
  //         { provide: getRepositoryToken(File), useValue: {} },
  //         { provide: getRepositoryToken(User), useValue: {} },
  //         { provide: getRepositoryToken(Hashtag), useValue: {} },
  //         { provide: getRepositoryToken(PostHashtag), useValue: {} },
  //         { provide: CACHE_MANAGER, useValue: {} },
  //         {
  //           provide: getRepositoryToken(Post),
  //           useValue: {
  //             create: jest.fn(),
  //             find: jest.fn(),
  //             update: jest.fn(),
  //             delete: jest.fn(),
  //             findOne: jest.fn(),
  //             softDelete: jest.fn(),
  //             save: jest.fn(),
  //           },
  //         },
  //         {
  //           provide: getRepositoryToken(Like),
  //           useValue: {
  //             create: jest.fn(),
  //             find: jest.fn(),
  //             update: jest.fn(),
  //             delete: jest.fn(),
  //             findOne: jest.fn(),
  //             softDelete: jest.fn(),
  //             save: jest.fn(),
  //           },
  //         },
  //       ],
  //     }).compile();
  //     service = module.get<PostsService>(PostsService);
  //     repo = module.get<Repository<Post>>(getRepositoryToken(Post));
  //   });

  //   it('should be defined', () => {
  //     expect(service).toBeDefined();
  //   });

  //   describe('CREATE', () => {
  //     it('should be defined', () => {
  //       expect(service.createPost).toBeDefined();
  //       expect(typeof service.createPost).toBe('function');
  //     });
  //     it('should return Post object', async () => {
  //       (repo.create as jest.Mock).mockReturnValue(newPosts[0]);
  //       const res = await service.createPost(createPostDto);
  //       expect(repo.create).toHaveBeenCalledWith(createPostDto);
  //       expect(res).toEqual(newPosts[0]);
  //     });
  //     it('should throw an error if it fails to create one', async () => {
  //       (repo.create as jest.Mock).mockReturnValue(null);
  //       try {
  //         await service.createPost(createPostDto);
  //       } catch (error) {
  //         expect(error.status).toBe(HttpStatus.BAD_REQUEST);
  //         expect(error.message).toBe('글 작성에 실패했습니다');
  //       }
  //     });
  //   });
  //   describe('READ', () => {
  //     it('should be defined', () => {
  //       expect(service.getPost).toBeDefined();
  //       expect(typeof service.getPost).toBe('function');
  //       // expect(service.readAllPosts).toBeDefined();
  //       // expect(typeof service.readAllPosts).toBe('function');
  //     });
  //     it('should return a post object', async () => {
  //       (repo.findOne as jest.Mock).mockReturnValue(newPosts[0]);
  //       const res = await service.getPost(3);
  //       expect(res).toStrictEqual(newPosts[0]);
  //     });
  //     it('should return post objects', async () => {
  //       (repo.find as jest.Mock).mockReturnValue(newPosts);
  //       // const res = await service.readAllPosts();
  //       // expect(res).toStrictEqual(newPosts);
  //     });
  //     it('should throw an error if there is no data found', async () => {
  //       (repo.findOne as jest.Mock).mockReturnValue(null);
  //       try {
  //         await service.getPost(5);
  //       } catch (error) {
  //         expect(error.status).toBe(HttpStatus.NOT_FOUND);
  //         expect(error.message).toBe('존재하지 않는 게시글입니다');
  //       }
  //       expect(repo.findOne).toHaveBeenCalled();
  //       expect(repo.findOne).toHaveBeenCalledWith(5);
  //     });
  //     it('should throw an error if no data exist', async () => {
  //       (repo.find as jest.Mock).mockReturnValue(null);
  //       try {
  //         // await service.readAllPosts();
  //       } catch (error) {
  //         expect(error.status).toBe(HttpStatus.NOT_FOUND);
  //         expect(error.message).toBe('존재하지 않는 게시글입니다');
  //       }
  //       expect(repo.find).toHaveBeenCalled();
  //     });
  //     it('should throw an error if it is a deleted post', async () => {
  //       (repo.findOne as jest.Mock).mockReturnValue(null);
  //       try {
  //         await service.getPost(newPosts[1].id);
  //       } catch (error) {
  //         expect(error.status).toBe(HttpStatus.NOT_FOUND);
  //         expect(error.message).toBe('존재하지 않는 게시글입니다');
  //       }
  //       expect(repo.findOne).toHaveBeenCalledTimes(1);
  //       expect(repo.findOne).toHaveBeenCalledWith(newPosts[1].id);
  //     });
  //   });
  //   describe('UPDATE', () => {
  //     const updateDto = {
  //       title: 'updated title',
  //       content: 'updated content',
  //       id: 3,
  //     };
  //     it('should be defined', () => {
  //       expect(service.updatePost).toBeDefined();
  //       expect(typeof service.updatePost).toBe('function');
  //     });
  //     it('should return updated post', async () => {
  //       (repo.findOne as jest.Mock).mockReturnValue(newPosts[0]);
  //       (repo.save as jest.Mock).mockReturnValue(updateDto);
  //       // const res = await service.updatePost(updateDto);
  //       // console.log(res);
  //       // expect(res).toStrictEqual(updateDto);
  //       expect(repo.findOne).toHaveBeenCalledTimes(1);
  //       expect(repo.save).toBeCalledTimes(1);
  //     });
  //     it('should throw an error if post does not exist', async () => {
  //       (repo.findOne as jest.Mock).mockReturnValue(null);
  //       (repo.update as jest.Mock).mockReturnValue(updateDto);

  //       try {
  //         // await service.updatePost(updateDto);
  //       } catch (error) {
  //         expect(error.status).toBe(HttpStatus.NOT_FOUND);
  //         expect(error.message).toBe('존재하지 않는 게시글입니다');
  //       }
  //       expect(repo.findOne).toBeCalled();
  //       expect(repo.update).toBeCalledTimes(0);
  //     });
  //     it('should throw an error if it is a deleted post', async () => {
  //       (repo.findOne as jest.Mock).mockReturnValue(null);
  //       try {
  //         // await service.updatePost(updateDto);
  //       } catch (error) {
  //         expect(error.status).toBe(HttpStatus.NOT_FOUND);
  //         expect(error.message).toBe('존재하지 않는 게시글입니다');
  //       }
  //       expect(repo.findOne).toBeCalledTimes(1);
  //       expect(repo.findOne).toBeCalledWith(updateDto.id);
  //     });
  //   });
  //   describe('DELETE', () => {
  //     it('should be defined', () => {
  //       expect(service.deletePost).toBeDefined();
  //       expect(typeof service.deletePost).toBe('function');
  //     });
  //     it('should throw an error if post does not exist', async () => {
  //       const postId = 3;
  //       (repo.findOne as jest.Mock).mockReturnValue(null);
  //       (repo.softDelete as jest.Mock).mockReturnValue(null);
  //       try {
  //         await service.deletePost(postId);
  //       } catch (error) {
  //         expect(error.status).toBe(HttpStatus.NOT_FOUND);
  //         expect(error.message).toBe('존재하지 않는 게시글입니다');
  //       }
  //       expect(repo.findOne).toHaveBeenCalled();
  //       expect(repo.findOne).toHaveBeenCalledWith(postId);
  //       expect(repo.softDelete).toHaveBeenCalledTimes(0);
  //       // expect()
  //       // expect
  //     });
  //     it('should return deleted post', async () => {
  //       const postId = 3;
  //       (repo.findOne as jest.Mock).mockReturnValue(newPosts[0]);
  //       (repo.save as jest.Mock).mockReturnValue(null);
  //       // (repo.softDelete as jest.Mock).mockReturnValue(null);
  //       const res = await service.deletePost(postId);
  //       expect(res).toStrictEqual(newPosts[0]);
  //       expect(res.deletedAt).toBeTruthy();
  //       // expect(repo.save).toHaveBeenCalledWith(postId);
  //       // expect(repo.softDelete).toHaveBeenCalledWith(postId);
  //     });
  //     it('should throw an error if post is already deleted', async () => {
  //       (repo.findOne as jest.Mock).mockReturnValue(null);
  //       try {
  //         await service.deletePost(2);
  //       } catch (error) {
  //         expect(error.status).toBe(HttpStatus.NOT_FOUND);
  //         expect(error.message).toBe('존재하지 않는 게시글입니다');
  //       }
  //       expect(repo.findOne).toBeCalledTimes(1);
  //       expect(repo.findOne).toBeCalledWith(2);
  //     });
  //   });
  //   describe('likePost', () => {
  //     it('shoud be defined', () => {
  //       expect(service.likeOrDislikePost).toBeDefined();
  //       expect(typeof service.likeOrDislikePost).toBe('function');
  //     });
  //     it('should return liked post', async () => {
  //       const postId = 3;
  //       const createLikeDto: CreateLikeDto = {
  //         targetId: 3,
  //         userId: 233,
  //         type: 'post',
  //         isLike: true,
  //       };
  //       const likedPost = { ...newPosts[0], like: newPosts[0].like + 1 };
  //       (repo.findOne as jest.Mock).mockReturnValue(newPosts[0]);
  //       (repo.save as jest.Mock).mockReturnValue(likedPost);
  //       const [like] = await service.likeOrDislikePost(createLikeDto);
  //       console.log(likedPost);
  //       expect(like).toBe(likedPost.like);
  //       expect(repo.findOne).toBeCalledWith(postId);
  //       expect(repo.save).toBeCalledWith(likedPost);
  //     });
  //   });
});
