import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { Post } from './entities/post.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from '../files/entities/file.entity';
// import { RedisCacheModule } from '../cache/cache.module';
import { RecommendedPost } from './entities/recommended_post.entity';
import { LikeModule } from '../like/likes.module';
import { HashtagsModule } from '../hashtags/hashtags.module';
import { CommentsModule } from '../comments/comments.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, File, RecommendedPost]),
    LikeModule,
    HashtagsModule,
    CommentsModule,
    // RedisCacheModule,
  ],
  exports: [PostsService],
  providers: [PostsService],
  controllers: [PostsController],
})
export class PostsModule {}
