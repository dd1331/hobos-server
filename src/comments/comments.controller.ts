import {
  Controller,
  Post,
  Body,
  Delete,
  Param,
  ParseIntPipe,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment-dto';
import { CreateChildCommentDto } from './dto/create-child-comment-dto';
import { CreateLikeDto } from '../like/dto/create-like-dto';
import { LikesService } from '../like/likes.service';
import { JwtAuthGuard } from '../auth/jwt-auth-guard';

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly likesService: LikesService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  create(@Body() dto: CreateCommentDto, @Req() req) {
    return this.commentsService.createComment(dto, req.user);
  }
  @UseGuards(JwtAuthGuard)
  @Post('create-child')
  createChild(@Body() dto: CreateChildCommentDto, @Req() req) {
    return this.commentsService.createChildComment(dto, req.user);
  }
  @Get('fetch-children/:id')
  fetchChildren(@Param('id', ParseIntPipe) id: number) {
    return this.commentsService.fetchChildComments(id);
  }
  @Get('post/:id')
  getComments(@Param('id', ParseIntPipe) id: number) {
    return this.commentsService.getActiveComments(id);
  }
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.commentsService.deleteComment(id);
  }
  @Delete('child/:id')
  deleteChild(@Param('id', ParseIntPipe) id: number) {
    return this.commentsService.deleteChildComment(id);
  }
  @UseGuards(JwtAuthGuard)
  @Post('like')
  like(@Body() dto: CreateLikeDto, @Req() req) {
    return this.likesService.likeOrDislike(dto, req.user);
  }
  @UseGuards(JwtAuthGuard)
  @Post('dislike')
  dislike(@Body() dto: CreateLikeDto, @Req() req) {
    return this.likesService.likeOrDislike(dto, req.user);
  }
}
