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
import { FilesModule } from './files/files.module';
import { WingmanModule } from './wingman/wingman.module';
import { LikeModule } from './like/likes.module';
import { HashtagsModule } from './hashtags/hashtags.module';
import { LocalsModule } from './locals/locals.module';

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
      charset: 'utf8mb4',
      autoLoadEntities: true,
      synchronize: false,
      dropSchema: process.env.NODE_ENV === 'test',
    }),
    UsersModule,
    AuthModule,
    PostsModule,
    CommentsModule,
    CommonModule,
    FilesModule,
    WingmanModule,
    LikeModule,
    HashtagsModule,
    LocalsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
