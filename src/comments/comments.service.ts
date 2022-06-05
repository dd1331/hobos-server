import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment-dto';
import { UpdateCommentDto } from './dto/update-comment-dto';
import { PostsService } from '../posts/posts.service';
import { ChildComment } from './entities/child_comment.entity';
import { CreateChildCommentDto } from './dto/create-child-comment-dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
    @InjectRepository(ChildComment)
    private readonly childCommentRepo: Repository<ChildComment>,
    private readonly postsService: PostsService,
  ) {}
  async createComment(dto: CreateCommentDto, user: User): Promise<Comment> {
    const post = await this.postsService.getPostOrFail(dto.postId);

    if (!post) return;

    const createdComment = await this.commentRepo.create(dto);
    createdComment.post = post;
    createdComment.commenter = user;
    await this.commentRepo.save(createdComment);

    return createdComment;
  }
  async createChildComment(
    dto: CreateChildCommentDto,
    commenter: User,
  ): Promise<ChildComment & Partial<Comment>> {
    const comment = await this.addChildCount(dto);

    const childComment = await this.childCommentRepo.create(dto);
    const post = await this.postsService.getPostOrFail(dto.postId);

    childComment.post = post;
    childComment.commenter = commenter;

    await this.childCommentRepo.save(childComment);
    await this.commentRepo.save(comment);

    return { ...childComment, childCount: comment.childCount };
  }
  private async addChildCount(dto: CreateChildCommentDto) {
    const parentComment = await this.getCommentOrFail(dto.parentId);
    parentComment.childCount += 1;
    return parentComment;
  }

  async getActiveComments(postId: number): Promise<Comment[]> {
    const comments: Comment[] = await this.commentRepo.find({
      where: { postId },
      relations: ['commenter', 'likes'],
    });

    if (!comments) {
      throw new HttpException(
        '댓글이 존재하지 않습니다',
        HttpStatus.NO_CONTENT,
      );
    }

    return comments;
  }
  async getCommentOrFail(id: number): Promise<Comment> {
    const comment = await this.commentRepo.findOne({ where: { id } });

    if (!comment) {
      throw new NotFoundException('댓글이 존재하지 않습니다');
    }

    return comment;
  }
  async getChildComment(id: number): Promise<ChildComment> {
    const comment = await this.childCommentRepo.findOne({ where: { id } });

    if (!comment) {
      throw new NotFoundException('댓글이 존재하지 않습니다');
    }

    return comment;
  }
  async fetchChildComments(parentId: number) {
    const comments = await this.childCommentRepo.find({
      where: { parentId },
      relations: ['commenter', 'likes'],
    });

    return comments;
  }
  async updateComment(dto: UpdateCommentDto): Promise<Comment> {
    const comment = await this.getCommentOrFail(dto.id);

    if (!comment) return;

    comment.content = dto.content;
    const updatedComment = await this.commentRepo.save(comment);

    return updatedComment;
  }

  async deleteComment(commentId: number): Promise<Comment> {
    const comment = await this.getCommentOrFail(commentId);

    if (!comment) return;

    comment.deletedAt = new Date();
    await this.commentRepo.save(comment);

    return comment;
  }
  async deleteChildComment(
    commentId: number,
  ): Promise<ChildComment & Partial<Comment>> {
    const comment = await this.getChildComment(commentId);

    if (!comment) return;

    const parent = await this.subtractChildCount(comment);

    comment.deletedAt = new Date();
    await this.commentRepo.save(parent);
    await this.childCommentRepo.save(comment);

    return { ...comment, childCount: parent.childCount };
  }

  private async subtractChildCount(comment: ChildComment) {
    const parent = await this.commentRepo.findOne({
      where: { id: comment.parentId },
    });
    parent.childCount -= 1;
    return parent;
  }

  async getCommentSumByUserId(id: number): Promise<number> {
    const commentSum = await this.getCommentSum(id);
    const childCommentSum = await this.getChildCommentSum(id);

    return commentSum + childCommentSum;
  }

  private async getChildCommentSum(commenterId: number) {
    return await this.childCommentRepo.count({
      where: { commenterId },
    });
  }

  private async getCommentSum(commenterId: number) {
    return await this.commentRepo.count({
      where: { commenterId },
    });
  }
}
