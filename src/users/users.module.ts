import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Post } from '../posts/entities/post.entity';
import { Like } from '../like/entities/like.entity';
import { File } from '../files/entities/file.entity';
import { RecommendedPost } from '../posts/entities/recommended_post.entity';
import { Hashtag } from '../hashtags/entities/hashtag.entity';
import { PostHashtag } from '../posts/entities/post_hashtag.entity';
import { PostsModule } from '../posts/posts.module';
import { CommentsModule } from '../comments/comments.module';
import { LikeModule } from '../like/likes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Post,
      Like,
      File,
      RecommendedPost,
      Hashtag,
      PostHashtag,
    ]),
    PostsModule,
    CommentsModule,
    LikeModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
  // exports: [CatsService] // shared module 다른 모듈에서 사용하기 위해서는 exports 해줘야함
})
export class UsersModule {}
