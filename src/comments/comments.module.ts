import { Module, forwardRef } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { CommentsService } from './comments.service';
import { PostsModule } from '../posts/posts.module';
import { ChildComment } from './entities/child_comment.entity';
import { LikeModule } from '../like/likes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment, ChildComment]),
    forwardRef(() => PostsModule),
    forwardRef(() => LikeModule),
  ],
  exports: [CommentsService],
  providers: [CommentsService],
  controllers: [CommentsController],
})
export class CommentsModule {}
