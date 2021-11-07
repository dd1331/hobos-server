import { Controller, Get } from '@nestjs/common';
import { HashtagsService } from './hashtags.service';

@Controller('hashtags')
export class HashtagsController {
  constructor(private readonly hashtagsService: HashtagsService) {}

  @Get('popular')
  getPopularHashtags() {
    return this.hashtagsService.getPopularHashtags();
  }
}
