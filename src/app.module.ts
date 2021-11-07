import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { User } from './users/entities/user.entity';
import { Post } from './posts/entities/post.entity';
import { Comment } from './comments/entities/comment.entity';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { APP_PIPE } from '@nestjs/core';
import { CommentsModule } from './comments/comments.module';
import { Like } from './like/entities/like.entity';
import { Category } from './common/entities/category.entity';
import { CommonModule } from './common/common.module';
import { NewsModule } from './news/news.module';
import { FilesModule } from './files/files.module';
import { File } from './files/entities/file.entity';
import { WingmanModule } from './wingman/wingman.module';
import { ChildComment } from './comments/entities/child_comment.entity';
import { LikeModule } from './like/likes.module';
import { HashtagsModule } from './hashtags/hashtags.module';
import { Hashtag } from './hashtags/entities/hashtag.entity';
import { PostHashtag } from './posts/entities/post_hashtag.entity';
// import { RedisCacheModule } from './cache/cache.module';
import { RecommendedPost } from './posts/entities/recommended_post.entity';
import { MatcherModule } from './matcher/matcher.module';
import { RoomLog } from './matcher/room_log.entity';
import { Room } from './matcher/room.entity';
import { Chat } from './matcher/chat.entity';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database:
        process.env.NODE_ENV === 'test'
          ? process.env.TEST_DATABASE_NAME
          : process.env.DATABASE_NAME,
      // host: process.env.MYSQL_HOST,
      // port: parseInt(process.env.MYSQL_PORT),
      // username: process.env.MYSQL_USER,
      // password: process.env.MYSQL_ROOT_PASSWORD,
      // database: process.env.MYSQL_DATABASE,
      charset: 'utf8mb4',
      entities: [
        User,
        Post,
        Comment,
        Like,
        Category,
        File,
        ChildComment,
        Hashtag,
        PostHashtag,
        RecommendedPost,
        RoomLog,
        Room,
        Chat,
      ],
      synchronize: true,
      dropSchema: process.env.NODE_ENV === 'test',
      // logging: true,
      // logging: ['error', 'log'],
    }),
    UsersModule,
    AuthModule,
    PostsModule,
    CommentsModule,
    CommonModule,
    NewsModule,
    FilesModule,
    WingmanModule,
    LikeModule,
    HashtagsModule,
    MatcherModule,
    // RedisCacheModule,
  ],
  controllers: [
    AppController,
    // NOTE no need to be added cause modules above are including controllers ?
    // PostsController,
    // AuthController,
    // UsersController,
    // CommentsController,
  ],
  providers: [
    AppService,
    //Note that in terms of dependency injection, global pipes registered from outside of any module (with useGlobalPipes() as in the example above) cannot inject dependencies since the binding has been done outside the context of any module. In order to solve this issue, you can set up a global pipe directly from any module using the following construction:
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    // CommentsService, // TODO 넣으면 에러
    //Note that in terms of dependency injection, global pipes registered from outside of any module (with useGlobalPipes() as in the example above) cannot inject dependencies since the binding has been done outside the context of any module. In order to solve this issue, you can set up a global pipe directly from any module using the following construction:
  ],
})
export class AppModule {}
