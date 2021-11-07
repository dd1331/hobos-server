import { Module, forwardRef } from '@nestjs/common';
import { LikeController } from './likes.controller';
import { Post } from '../posts/entities/post.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from './entities/like.entity';
import { File } from '../files/entities/file.entity';
import { Comment } from '../comments/entities/comment.entity';
import { ChildComment } from '../comments/entities/child_comment.entity';
import { LikesService } from './likes.service';
import { PostsModule } from '../posts/posts.module';
import { CommentsModule } from '../comments/comments.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, Like, File, Comment, ChildComment]),
    CommentsModule,
    forwardRef(() => PostsModule),
  ],
  providers: [LikesService],
  exports: [LikesService],
  controllers: [LikeController],
})
export class LikeModule {}
