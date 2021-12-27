import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth-guard';
import { CreateReviewDto } from './dto/create-review.dto';
import { LocalsService } from './locals.service';
import { UserContext } from '../users/user.decorator';
import { User } from '../users/entities/user.entity';

@Controller('locals')
export class LocalsController {
  constructor(private readonly localsService: LocalsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('review')
  create(@Body() dto: CreateReviewDto, @UserContext() user: User) {
    return this.localsService.createReview(dto, user);
  }
}
