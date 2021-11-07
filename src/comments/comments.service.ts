import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
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
  ): Promise<ChildComment> {
    const childComment = await this.childCommentRepo.create(dto);
    const parentComment = await this.readComment(dto.parentId);
    const post = await this.postsService.getPostOrFail(dto.postId);
    parentComment.childCount += 1;
    await this.commentRepo.save(parentComment);
    childComment.post = post;
    childComment.commenter = commenter;
    await this.childCommentRepo.save(childComment);

    return childComment;
  }
  async getActiveComments(postId: number): Promise<Comment[]> {
    const comments: Comment[] = await this.commentRepo.find({
      where: { postId },
      relations: ['commenter', 'likes'],
    });

    if (!comments) {
      throw new HttpException('댓글이 존재하지 않습니다', HttpStatus.NOT_FOUND);
    }

    return comments;
  }
  async readComment(commentId: number): Promise<Comment> {
    const comment = await this.commentRepo.findOne(commentId);

    if (!comment) {
      throw new HttpException('댓글이 존재하지 않습니다', HttpStatus.NOT_FOUND);
    }

    return comment;
  }
  async readChildComment(commentId: number): Promise<ChildComment> {
    const comment = await this.childCommentRepo.findOne(commentId);

    if (!comment) {
      throw new HttpException('댓글이 존재하지 않습니다', HttpStatus.NOT_FOUND);
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
    const comment = await this.readComment(dto.id);

    if (!comment) return;

    comment.content = dto.content;
    const updatedComment = await this.commentRepo.save(comment);

    return updatedComment;
  }

  async deleteComment(commentId: number): Promise<Comment> {
    const comment = await this.readComment(commentId);

    if (!comment) return;

    comment.deletedAt = new Date();
    await this.commentRepo.save(comment);

    return comment;
  }
  async deleteChildComment(commentId: number): Promise<ChildComment> {
    const comment = await this.childCommentRepo.findOne(commentId);

    if (!comment) return;

    const parent = await this.commentRepo.findOne(comment.parentId);
    parent.childCount -= 1;
    comment.deletedAt = new Date();
    await this.commentRepo.save(parent);
    await this.childCommentRepo.save(comment);

    return comment;
  }
  async getCommentSumByUserId(id: number): Promise<number> {
    const parentSum = await this.commentRepo.count({
      where: { commenter: id },
    });
    const childSum = await this.childCommentRepo.count({
      where: { commenter: id },
    });

    return parentSum + childSum;
  }
}
