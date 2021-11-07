import { Module } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';
// import { RedisCacheModule } from '../cache/cache.module';
import { FilesModule } from '../files/files.module';

@Module({
  // imports: [RedisCacheModule, TypeOrmModule.forFeature([File])],
  imports: [FilesModule],
  controllers: [NewsController],
  providers: [NewsService],
})
export class NewsModule {}
