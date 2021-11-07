import { Controller, Get, Param } from '@nestjs/common';
import { CommonService } from './common.service';

@Controller('common')
export class CommonController {
  constructor(private readonly commonService: CommonService) {}

  @Get('categories/:type')
  getCategories(@Param('type') type: string) {
    return this.commonService.getCategories(type);
  }
}
