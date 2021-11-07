import { Injectable } from '@nestjs/common';
import { Like } from './entities/like.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../posts/entities/post.entity';
import { Comment } from '../comments/entities/comment.entity';
import { Repository } from 'typeorm';
import { PostsService } from '../posts/posts.service';
import { CreateLikeDto } from './dto/create-like-dto';
import { CommentsService } from '../comments/comments.service';
import { ChildComment } from '../comments/entities/child_comment.entity';
import { User } from '../users/entities/user.entity';

type LikeTarget = Post | Comment | ChildComment;
const POST = 'post';
const COMMENT = 'comment';
const CHILD_COMMENT = 'childComment';

@Injectable()
export class LikesService {
  constructor(
    // TODO refactor
    @InjectRepository(Post) private readonly postRepo: Repository<Post>,
    @InjectRepository(Like) private readonly likeRepo: Repository<Like>,
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
    @InjectRepository(ChildComment)
    private readonly childCommentRepo: Repository<ChildComment>,
    private postsService: PostsService,
    private commentsService: CommentsService,
  ) {}
  async likeOrDislike(dto: CreateLikeDto, user: User): Promise<Like[]> {
    const targetEntity: LikeTarget = await this.getTargetEntity(dto);

    if (!targetEntity) return;

    const [like] = await this.getLikes(dto, true);

    if (!like) await this.createLike(dto, targetEntity, user);

    if (like) await this.updateLikeCount(like, dto, targetEntity);

    const likes = await this.getLikes(dto);
    return likes;
  }
  async getLikes(dto: CreateLikeDto, isMine?): Promise<Like[]> {
    const where = { type: dto.type };

    if (isMine) where['user'] = { id: dto.userId };

    if (dto.type === POST) where[POST] = { id: dto.targetId };

    if (dto.type === COMMENT) where[COMMENT] = { id: dto.targetId };

    if (dto.type === CHILD_COMMENT) where[CHILD_COMMENT] = { id: dto.targetId };

    const likes = await this.likeRepo.find({ where });

    return likes;
  }
  async updateLikeCount(
    like: Like,
    dto: CreateLikeDto,
    target: LikeTarget,
  ): Promise<Like> {
    const status: boolean | null = like.isLike;
    const { isLike } = dto;

    if (status === null && dto.isLike) {
      target.likeCount += 1;
      like.isLike = dto.isLike;
    }
    if (status === null && !dto.isLike) {
      target.dislikeCount += 1;
      like.isLike = dto.isLike;
    }
    if (status === true && dto.isLike) {
      target.likeCount -= 1;
      like.isLike = null;
    }
    if (status === true && !dto.isLike) {
      target.likeCount -= 1;
      target.dislikeCount += 1;
      like.isLike = dto.isLike;
    }
    if (status === false && dto.isLike) {
      target.likeCount += 1;
      target.dislikeCount -= 1;
      like.isLike = dto.isLike;
    }
    if (status === false && !dto.isLike) {
      target.dislikeCount -= 1;
      like.isLike = null;
    }

    await this.saveTarget(dto, target);
    await this.likeRepo.save(like);

    return like;
  }
  async createLike(dto: CreateLikeDto, target: LikeTarget, user: User) {
    if (dto.isLike) target.likeCount += 1;
    if (!dto.isLike) target.dislikeCount += 1;

    this.saveTarget(dto, target);
    const like: Like = await this.likeRepo.create(dto);

    if (dto.type === POST) like.post = target as Post;

    if (dto.type === COMMENT) like.comment = target as Comment;

    if (dto.type === CHILD_COMMENT) like.childComment = target as ChildComment;

    like.user = user;
    await this.likeRepo.save(like);

    return like;
  }
  async getTargetEntity(dto: CreateLikeDto) {
    if (dto.type === POST)
      return await this.postsService.getPostOrFail(dto.targetId);

    if (dto.type === COMMENT)
      return await this.commentsService.readComment(dto.targetId);

    if (dto.type === CHILD_COMMENT)
      return await this.commentsService.readChildComment(dto.targetId);
  }
  async saveTarget(dto: CreateLikeDto, target: LikeTarget) {
    if (dto.type === POST) await this.postRepo.save(target);

    if (dto.type === COMMENT) await this.commentRepo.save(target);

    if (dto.type === CHILD_COMMENT) await this.childCommentRepo.save(target);
  }

  async getLikeSumByUserId(userId: number) {
    return await this.likeRepo.count({ where: { userId, isLike: true } });
  }
  async getDisLikeSumByUserId(userId: number) {
    return await this.likeRepo.count({ where: { userId, isLike: false } });
  }
}
