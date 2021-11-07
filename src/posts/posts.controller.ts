import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { CreateLikeDto } from '../like/dto/create-like-dto';
import { LikesService } from '../like/likes.service';
import { GetPostsDto } from './dto/get-posts.dto';
import { JwtAuthGuard } from '../auth/jwt-auth-guard';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly likesService: LikesService,
  ) {}

  @Post('create')
  create(@Body() dto: CreatePostDto) {
    return this.postsService.createPost(dto);
  }
  @Get()
  getPosts(@Query() dto: GetPostsDto) {
    return this.postsService.getPosts(dto);
  }

  @Get('recent')
  getRecentPosts(@Req() req) {
    return this.postsService.getRecentPosts();
  }

  @Get('popular')
  getPopularPosts() {
    return this.postsService.getPopularPosts();
  }
  @Get('recommended')
  getRecommendedPosts() {
    return this.postsService.getRecommendedPosts();
  }
  @Get('emphasized')
  getEmphasizedPosts(@Query() dto: GetPostsDto) {
    return this.postsService.getEmphasizedPosts(dto);
  }
  @Get('search')
  getPostsWithKeyword(@Query() dto: GetPostsDto) {
    return this.postsService.getPostsWithKeyword(dto);
  }

  @Get(':id')
  getPost(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.readPost(id);
  }

  @Patch()
  updatePost(@Body() dto: UpdatePostDto) {
    return this.postsService.updatePost(dto);
  }

  @Delete(':id')
  deletePost(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.deletePost(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('like')
  likePost(@Body() dto: CreateLikeDto, @Req() req) {
    return this.likesService.likeOrDislike(dto, req.user);
  }
  @UseGuards(JwtAuthGuard)
  @Post('dislike')
  dislikePost(@Body() dto: CreateLikeDto, @Req() req) {
    return this.likesService.likeOrDislike(dto, req.user);
  }
}
