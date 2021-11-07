import { Module } from '@nestjs/common';
import { WingmanService } from './wingman.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '../posts/entities/post.entity';
import { PostsModule } from '../posts/posts.module';
import { FilesModule } from '../files/files.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
    PostsModule,
    UsersModule,
    FilesModule,
  ],
  providers: [WingmanService],
})
export class WingmanModule {}
