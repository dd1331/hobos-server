import {
  Injectable,
  BadRequestException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Like as TLike } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { Repository, Between, In, FindManyOptions } from 'typeorm';
import { UpdatePostDto } from './dto/update-post.dto';
import { HashtagsService } from '../hashtags/hashtags.service';
import { File } from '../files/entities/file.entity';
import * as dayjs from 'dayjs';
import { GetPostsDto } from './dto/get-posts.dto';
import { RecommendedPost } from './entities/recommended_post.entity';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private readonly postRepo: Repository<Post>,
    @InjectRepository(File) private readonly fileRepo: Repository<File>,
    @InjectRepository(RecommendedPost)
    private readonly recommendedPost: Repository<RecommendedPost>,
    private readonly hashtagsService: HashtagsService,
    private readonly dataSource: DataSource,
  ) {}
  private readonly logger = new Logger(PostsService.name);

  async createPost(dto: CreatePostDto) {
    return this.dataSource.transaction(async (manager) => {
      const { hashtags, fileId } = dto;
      const entity = manager.create(Post, dto);
      const newPost = await manager.save(entity);
      if (!newPost) throw new BadRequestException('글 작성에 실패했습니다');

      // TODO add to other methods
      if (hashtags) await this.hashtagsService.createTx(manager, newPost, dto);
      if (fileId) {
        newPost.files = await this.fileRepo.find({ where: { id: fileId } });
        await manager.save(newPost);
      }
      return newPost;
    });
  }

  async createPostByWingman(dto: CreatePostDto): Promise<Post> {
    const post = this.postRepo.create(dto);

    return this.postRepo.save(post);
  }
  async getPostOrFail(id: number): Promise<Post> {
    //TODO: exclude softdeleted likes
    const post = await this.postRepo.findOne({
      where: { id },
      relations: ['poster', 'comments', 'comments.commenter', 'likes', 'files'],
    });

    if (!post) throw new NotFoundException('존재하지 않는 게시글입니다');

    return post;
  }
  async readPostAndCount(id: number): Promise<Post> {
    const post = await this.getPostOrFail(id);
    // TODO: use event or subscirber
    post.read();
    return this.postRepo.save(post);
  }
  async getPosts(dto: GetPostsDto): Promise<Post[]> {
    // TODO find better way of setting default when dto used
    const take = dto.take ? dto.take : 20;
    const skip = dto.page ? (dto.page - 1) * take : 0;
    const where = dto.category ? { category: dto.category } : {};

    if (dto.hashtagId || dto.hashtagTitle) {
      const postIds = await this.hashtagsService.getPostIdsByHashtag(
        dto.hashtagId ? dto.hashtagId : dto.hashtagTitle,
        dto.hashtagId ? 'hashtagId' : 'postId',
      );
      where['id'] = In(postIds);
    }
    return this.postRepo.find({
      where,
      relations: ['poster', 'comments', 'files'],
      order: {
        createdAt: 'DESC',
      },
      take,
      skip,
    });
  }
  async getPostsWithKeyword(dto: GetPostsDto): Promise<Post[]> {
    // TODO: user dto validation
    if (!dto.keyword) throw new BadRequestException();
    // TODO: seperate search options
    // there must be a better way of using like function
    const take = dto.take ? dto.take : 20;
    const skip = dto.page ? (dto.page - 1) * take : 0;
    return this.postRepo.find({
      where: [
        { title: TLike(`%${dto.keyword}%`) },
        { title: TLike(`${dto.keyword}%`) },
        { title: TLike(`$${dto.keyword}`) },
        { content: TLike(`%${dto.keyword}%`) },
        { content: TLike(`${dto.keyword}%`) },
        { content: TLike(`$${dto.keyword}`) },
      ],
      take,
      skip,
    });
  }

  async getRecentPosts(): Promise<Post[]> {
    const findOptions: FindManyOptions<Post> = {
      relations: ['poster', 'comments', 'files'],
      take: 5,
      order: { createdAt: 'DESC' },
    };

    return this.postRepo.find(findOptions);
  }
  async getPopularPosts(): Promise<Post[]> {
    const findOptions: FindManyOptions<Post> = {
      where: {
        createdAt: Between(dayjs().subtract(7, 'd').toDate(), dayjs().toDate()),
      },
      relations: ['comments'],
      order: { views: 'DESC' },
      take: 5,
    };

    return this.postRepo.find(findOptions);
  }
  async getRecommendedPosts(): Promise<Post[]> {
    const postIds = await this.getRecommendedPostIds();
    const findOptions: FindManyOptions<Post> = {
      where: { id: In(postIds) },
      order: { likeCount: 'DESC' },
      relations: ['files'],
      take: 12,
    };

    return this.postRepo.find(findOptions);
  }

  // TODO: move to proper module
  @Cron(CronExpression.EVERY_HOUR)
  async setRecommendedPosts(): Promise<void> {
    this.logger.debug(
      `setRecommendedPosts started ${PostsService.name} ${Date.now()}`,
    );
    const postIds = await this.getPostIdsWithImage();
    const postsWithImage = await this.getPostsWithImage(postIds);
    await Promise.all(
      postsWithImage.map(async ({ id }) => {
        const exist = await this.recommendedPost.findOne({
          where: { postId: id },
        });
        if (exist) {
          exist.updatedAt = dayjs().toDate();
          return this.recommendedPost.save(exist);
        }
        const recommendedPost = this.recommendedPost.create({
          postId: id,
        });
        return this.recommendedPost.save(recommendedPost);
      }),
    );
  }
  getPostsWithImage(ids: number[]): Promise<Post[]> {
    return this.postRepo.find({
      where: { id: In(ids) },
      order: { likeCount: 'DESC', createdAt: 'DESC' },
      take: 12,
    });
  }
  async getRecommendedPostIds(): Promise<number[]> {
    const posts = await this.recommendedPost.find({
      order: { updatedAt: 'DESC' },
      take: 12,
    });
    return posts.map(({ postId }) => postId);
  }

  async getPostIdsWithImage(): Promise<number[]> {
    const files = await this.fileRepo.find({
      where: {
        createdAt: Between(
          dayjs().subtract(10, 'd').toDate(),
          dayjs().toDate(),
        ),
      },
    });
    return files.map(({ postId }) => postId);
  }
  async getEmphasizedPosts({ category }: GetPostsDto): Promise<Post[]> {
    const findOptions: FindManyOptions<Post> = {
      where: {
        // TODO add created filter
        category,
      },
      order: { likeCount: 'DESC' },
      take: 5,
    };

    return this.postRepo.find(findOptions);
  }

  async updatePost({
    title,
    content,
    id,
    fileId,
  }: UpdatePostDto): Promise<Post> {
    const existingPost = await this.getPostOrFail(id);

    existingPost.title = title;
    existingPost.content = content;

    if (fileId) {
      existingPost.files = await this.fileRepo.find({
        where: { id: fileId },
      });
    }

    return this.postRepo.save(existingPost);
  }
  async deletePost(postId: number): Promise<Post> {
    // TODO softdelete related comments
    const post = await this.getPostOrFail(postId);
    await this.postRepo.softRemove(post);

    return this.postRepo.save(post);
  }

  getPostSumByUserId(poster: number): Promise<number> {
    return this.postRepo.count({ where: { poster } });
  }
}
