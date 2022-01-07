import {
  Controller,
  UseGuards,
  Post,
  Req,
  Get,
  Body,
  HttpCode,
  Res,
  UseFilters,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { BulkedUser } from '../users/users.type';
import { LocalAuthGuard } from './local/local-auth.guard';
import { LoginDto } from './dto/login-dto';
import { JwtAuthGuard } from './jwt-auth-guard';
import { NaverAuthGuard } from './naver/naver.auth.guard';
import { RedirectExceptionFilter } from '../filters/redirect-exception.filter';
import { UserContext } from '../users/user.decorator';
import { User } from '../users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @Post('jwt')
  async jwtLogin(@Req() req) {
    const user: BulkedUser = await this.authService.login(req.user);
    return user;
  }
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  login(@Body() dto: LoginDto, @Req() req) {
    return this.authService.login(req.user);
  }
  @UseGuards(JwtAuthGuard)
  @Get('login')
  login2(@Req() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(NaverAuthGuard)
  @Get('naver/signup')
  naverSignup() {
    console.log('called');
  }

  @UseGuards(NaverAuthGuard)
  @Get('naver')
  naverLogin(@Req() req) {
    return req.user;
  }
  @UseFilters(RedirectExceptionFilter)
  @UseGuards(NaverAuthGuard)
  @Get('naver/callback')
  async callback(
    @UserContext() user: User,
    @Res() res: Response,
  ): Promise<any> {
    const { accessToken } = await this.authService.login(user);
    res.redirect(
      `${process.env.OAUTH_CALLBACK_URL_CLIENT}?accessToken=${accessToken}`,
    );
    return user;
  }

  @Get('naver/redirect')
  naverAuthRedirect(@Req() req: Request) {}
}
