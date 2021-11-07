import { Module } from '@nestjs/common';
import { MatcherGateway } from './matcher.gateway';
import { MatcherService } from './matcher.service';
import { Room } from './room.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './chat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Room, Chat])],
  providers: [MatcherService, MatcherGateway],
})
export class MatcherModule {}
