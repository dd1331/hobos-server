import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { APP_PIPE } from '@nestjs/core';
import { CommentsModule } from './comments/comments.module';
import { CommonModule } from './common/common.module';
import { NewsModule } from './news/news.module';
import { FilesModule } from './files/files.module';
import { WingmanModule } from './wingman/wingman.module';
import { LikeModule } from './like/likes.module';
import { HashtagsModule } from './hashtags/hashtags.module';
import { MatcherModule } from './matcher/matcher.module';
import { LocalsModule } from './locals/locals.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(),
    // TypeOrmModule.forRootAsync({
    //   useFactory: async () =>
    //     Object.assign(await getConnectionOptions(), {
    //       autoLoadEntities: true,
    //       // migrations: [__dirname + '/migrations/**/*.ts'],
    //     }),
    // }),
    // TypeOrmModule.forRoot({
    //   type: 'mysql',
    //   host: process.env.DATABASE_HOST,
    //   port: parseInt(process.env.DATABASE_PORT),
    //   username: process.env.DATABASE_USERNAME,
    //   password: process.env.DATABASE_PASSWORD,
    //   database:
    //     process.env.NODE_ENV === 'test'
    //       ? process.env.TEST_DATABASE_NAME
    //       : process.env.DATABASE_NAME,
    //   charset: 'utf8mb4',
    //   entities: [
    //     User,
    //     Post,
    //     Comment,
    //     Like,
    //     Category,
    //     File,
    //     ChildComment,
    //     Hashtag,
    //     PostHashtag,
    //     RecommendedPost,
    //     RoomLog,
    //     Room,
    //     Chat,
    //     Review,
    //   ],
    //   synchronize: true,
    //   dropSchema: process.env.NODE_ENV === 'test',
    //   // dropSchema: true,
    //   // logging: true,
    //   // logging: ['error', 'log'],
    // }),
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
    LocalsModule,
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
