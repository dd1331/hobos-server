import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from '../posts.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Post } from '../entities/post.entity';
import {  NotFoundException } from '@nestjs/common';
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
import { AuthService } from '../../auth/auth.service';


describe('PostsService', () => {
  let postsService: PostsService;
  let usersService: UsersService;
  let repo: Repository<Post>;
  let mockedPostRepo;
  let mockedUserRepo;

  beforeEach(async () => {
    mockedPostRepo = {
      findOne: (id): Partial<Post> => {
        return { id, views: 0 };
      },
      create: ({ title, content }: Partial<CreatePostDto>): Partial<Post> => {
        return { id: Date.now().valueOf(), title, content };
      },
      save: (dto: Partial<Post>) => {
        return { ...dto };
      },
    };
    mockedUserRepo = {
      create: (): Partial<User> => {
        return {};
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        PostsService,
        HashtagsService,
        CommentsService,
        LikesService,
        { provide: getRepositoryToken(File), useValue: {} },
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
    usersService = module.get<UsersService>(UsersService);
    repo = module.get<Repository<Post>>(getRepositoryToken(Post));
  });

  describe('getPost', () => {
    it('존재하는 경우 Post 리턴', async () => {
      const id = 3;
      const result = await postsService.getPost(id);
      expect(result.id).toBe(id);
    });
    it('존재하지 않는 경우 NotFoundException', async () => {
      mockedPostRepo.findOne = () => Promise.resolve(null);
      const result = async () => await postsService.getPost(111);
      expect(result()).rejects.toThrow(NotFoundException);
      // TODO add custom message test
    });
  });

  