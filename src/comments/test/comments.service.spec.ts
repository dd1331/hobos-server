// import { Test, TestingModule } from '@nestjs/testing';
// import { Repository } from 'typeorm';
// import { Comment } from '../entities/comment.entity';
// import { getRepositoryToken } from '@nestjs/typeorm';
// import { CreateCommentDto } from '../dto/create-comment-dto';
// import { HttpStatus } from '@nestjs/common';
// import { Post } from '../../posts/entities/post.entity';
// import { PostsService } from '../../posts/posts.service';
// import { CommentsService } from '../comments.service';
// import { UpdateCommentDto } from '../dto/update-comment-dto';

describe('CommentsService', () => {
  it('', () => {
    return;
  });
  //   let commentsService: CommentsService;
  //   let commentRepo: Repository<Comment>;
  //   let postRepo: Repository<Post>;
  //   let createCommentDto: CreateCommentDto;
  //   let createdComment: Partial<Comment>;
  //   let updateCommentDto: UpdateCommentDto;
  //   let post: Partial<Post>;
  //   let postsService: PostsService;
  //   let comments: Partial<Comment>[];

  //   beforeAll(async () => {
  //     const module: TestingModule = await Test.createTestingModule({
  //       providers: [
  //         PostsService,
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
  //         CommentsService,
  //         {
  //           provide: getRepositoryToken(Comment),
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

  //     postsService = module.get<PostsService>(PostsService);
  //     postRepo = module.get<Repository<Post>>(getRepositoryToken(Post));
  //     commentsService = module.get<CommentsService>(CommentsService);
  //     commentRepo = module.get<Repository<Comment>>(getRepositoryToken(Comment));
  //   });
  //   beforeEach(async () => {
  //     createCommentDto = {
  //       postId: 40,
  //       commenterId: 3,
  //       content: 'tset',
  //     };
  //     createdComment = {
  //       id: 3,
  //       postId: 50,
  //       content: 'test',
  //     };
  //     updateCommentDto = {
  //       id: createdComment.id,
  //       content: 'updated content',
  //     };
  //     comments = [
  //       {
  //         id: 0,
  //         postId: 50,
  //         content: 'test',
  //       },
  //       {
  //         id: 1,
  //         postId: 50,
  //         content: 'test2',
  //       },
  //       {
  //         id: 2,
  //         postId: 50,
  //         content: 'test3',
  //       },
  //     ];
  //     post = {
  //       id: 50,
  //       title: 'tset title',
  //       content: 'test content',
  //     };
  //     // comments = await commentsService.readPostComments(post.id);
  //     // comments = await commentsService.readAllComments();
  //   });

  //   it('should be defined', () => {
  //     expect(commentsService).toBeDefined();
  //   });
  //   describe('CREATE', () => {
  //     it('should be defined', async () => {
  //       expect(commentsService.createComment).toBeDefined();
  //       expect(typeof commentsService.createComment).toBe('function');
  //     });
  //     it('should return a created object', async () => {
  //       (commentRepo.create as jest.Mock).mockReturnValue(createdComment);
  //       // (commentRepo.save as jest.Mock).mockReturnValue(comments[0]);
  //       const res = await commentsService.createComment(createCommentDto);
  //       expect(res.id).toEqual(expect.any(Number));
  //       expect(res.postId).toEqual(expect.any(Number));
  //       expect(res.content).toEqual(expect.any(String));
  //       expect(commentRepo.create).toBeCalledWith(createCommentDto);
  //       expect(commentRepo.save).toBeCalled();
  //     });
  //     it('should throw an error if content is empty', async () => {
  //       // TODO e2e test or controller test?
  //       // (commentRepo.create as jest.Mock).mockReturnValue(null);
  //       // (postRepo.findOne as jest.Mock).mockReturnValue(comments[0]);
  //       // const invalidCreateCommentDto: CreateCommentDto = {
  //       //   ...createCommentDto,
  //       //   content: '',
  //       // };
  //       // try {
  //       //   await commentsService.createComment(invalidCreateCommentDto);
  //       // } catch (err) {
  //       //   expect(err.status).toBe(HttpStatus.BAD_REQUEST);
  //       //   expect(err.message).toBe('댓글 작성에 실패했습니다');
  //       // }
  //       // expect(commentRepo.create).toHaveBeenCalledWith(invalidCreateCommentDto);
  //       // expect(commentRepo.save).toBeCalledTimes(0);
  //     });
  //     it('should throw an error if post does not exist', async () => {
  //       (commentRepo.create as jest.Mock).mockReturnValue(null);
  //       (postRepo.findOne as jest.Mock).mockReturnValue(null);
  //       try {
  //         await commentsService.createComment(createCommentDto);
  //       } catch (err) {
  //         expect(err.status).toBe(HttpStatus.NOT_FOUND);
  //         expect(err.message).toBe('존재하지 않는 게시글입니다');
  //       }
  //       expect(postRepo.findOne).toHaveBeenCalledWith(createCommentDto.postId);
  //       expect(commentRepo.create).toHaveBeenCalledTimes(0);
  //     });
  //   });
  //   describe('READ', () => {
  //     it('should be defined', async () => {
  //       expect(commentsService.readComment).toBeDefined();
  //       expect(typeof commentsService.readComment).toBe('function');
  //     });
  //     it('should return a comment obejct', async () => {
  //       (commentRepo.findOne as jest.Mock).mockReturnValue(comments[0]);
  //       const res = await commentsService.readComment(comments[0].id);
  //       expect(commentRepo.findOne).toBeCalledWith(comments[0].id);
  //       expect(res.content).toBe(comments[0].content);
  //       expect(res.postId).toBe(comments[0].postId);
  //       expect(res.id).toBe(comments[0].id);
  //     });
  //     it('should throw an error if the comment is not existing', async () => {
  //       (commentRepo.findOne as jest.Mock).mockReturnValue(null);
  //       const invalidCommentId = 9999;
  //       try {
  //         await commentsService.readComment(invalidCommentId);
  //       } catch (error) {
  //         expect(error.status).toBe(HttpStatus.NOT_FOUND);
  //         expect(error.message).toBe('댓글이 존재하지 않습니다');
  //       }
  //       expect(commentRepo.findOne).toBeCalledWith(invalidCommentId);
  //     });
  //     it('should return comment list on a specified post', async () => {
  //       (postRepo.findOne as jest.Mock).mockReturnValue(post);
  //       (commentRepo.find as jest.Mock).mockReturnValue(comments);
  //       // const res = await commentsService.readPostComments(createdComment.postId);
  //       // expect(res).toHaveLength(res.length);
  //       // expect(res).toStrictEqual(comments);
  //       // expect(res).toEqual(expect.any(Array));
  //     });
  //     it('should throw an error if no comment exist on a specified post', async () => {
  //       (commentRepo.find as jest.Mock).mockReturnValue(null);
  //       try {
  //         // await commentsService.readPostComments(createdComment.postId);
  //       } catch (error) {
  //         expect(error.status).toBe(HttpStatus.NOT_FOUND);
  //         expect(error.message).toBe('댓글이 존재하지 않습니다');
  //       }
  //       expect(commentRepo.find).toHaveBeenCalledWith({
  //         where: { postId: createdComment.postId },
  //       });
  //     });
  //   });

  //   describe('UPDATE', () => {
  //     it('should be defined', async () => {
  //       expect(commentsService.updateComment).toBeDefined();
  //       expect(typeof commentsService.updateComment).toBe('function');
  //     });
  //     it('should return updated comment', async () => {
  //       const updatedComment: Partial<Comment> = {
  //         ...createdComment,
  //         id: updateCommentDto.id,
  //         content: updateCommentDto.content,
  //       };
  //       (commentRepo.findOne as jest.Mock).mockReturnValue(createdComment);
  //       (commentRepo.save as jest.Mock).mockReturnValue(updatedComment);
  //       const res: Comment = await commentsService.updateComment(
  //         updateCommentDto,
  //       );
  //       expect(res.id).toBe(updateCommentDto.id);
  //       expect(res.content).toBe(updateCommentDto.content);
  //       expect(commentRepo.findOne).toBeCalledWith(updateCommentDto.id);
  //       expect(commentRepo.save).toBeCalledTimes(1);
  //     });
  //     it('should throw error if input data is not valid', async () => {
  //       // TODO e2e or controller test
  //       // (commentRepo.findOne as jest.Mock).mockReturnValue(createdComment);
  //       // (commentRepo.save as jest.Mock).mockReturnValue(expect.any(Comment));
  //       // const invalidUpdateCommentDto = {
  //       //   ...updateCommentDto,
  //       //   content: '',
  //       // };
  //       // try {
  //       //   await commentsService.updateComment(invalidUpdateCommentDto);
  //       // } catch (error) {
  //       //   expect(error.statusCode).toBe(HttpStatus.BAD_REQUEST);
  //       //   expect(error.message).toHaveLength(1);
  //       // }
  //       // expect(commentRepo.find).toBeCalledWith(invalidUpdateCommentDto.id);
  //       // expect(commentRepo.save).toBeCalledTimes(0);
  //     });
  //     it('should throw an error if comment does not exist', async () => {
  //       (commentRepo.findOne as jest.Mock).mockReturnValue(expect.any(Comment));
  //       (commentRepo.save as jest.Mock).mockReturnValue(expect.any(Comment));
  //       const invalidUpdateCommentDto = {
  //         ...updateCommentDto,
  //         id: 999999,
  //       };
  //       try {
  //         await commentsService.updateComment(invalidUpdateCommentDto);
  //       } catch (error) {
  //         expect(error.statusCode).toBe(HttpStatus.NOT_FOUND);
  //         expect(error.message).toBe('댓글이 존재하지 않습니다');
  //       }
  //       expect(commentRepo.findOne).toBeCalledWith(invalidUpdateCommentDto.id);
  //     });
  //   });
  //   describe('DELETE', () => {
  //     it('should be defined', async () => {
  //       expect(commentsService.deleteComment).toBeDefined();
  //       expect(typeof commentsService.deleteComment).toBe('function');
  //     });
  //     it('should return deleted comment with truthy deleted column', async () => {
  //       (commentRepo.findOne as jest.Mock).mockReturnValue(comments[0]);
  //       (commentRepo.save as jest.Mock).mockReturnValue(comments[0]);
  //       const res = await commentsService.deleteComment(comments[0].id);
  //       expect(commentRepo.findOne).toBeCalledWith(comments[0].id);
  //       expect(commentRepo.save).toBeCalled();
  //       expect(res.deletedAt).toBeTruthy();
  //     });
  //     it('should throw an error if comment does not exist', async () => {
  //       (commentRepo.findOne as jest.Mock).mockReturnValue(null);
  //       try {
  //         await commentsService.deleteComment(9999999);
  //       } catch (error) {
  //         expect(error.status).toBe(HttpStatus.NOT_FOUND);
  //         expect(error.message).toBe('댓글이 존재하지 않습니다');
  //       }
  //       expect(commentRepo.findOne).toBeCalledWith(9999999);
  //     });
  //   });
});
