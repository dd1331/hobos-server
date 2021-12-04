import { Controller, Get } from '@nestjs/common';
import { LocalsService } from './locals.service';

@Controller('locals')
export class LocalsController {
  constructor(private readonly localsService: LocalsService) {}
  @Get('ranking/city')
  getRanking() {
    return this.localsService.getLocalRankingByCity();
  }
}
