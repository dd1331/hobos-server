import {
  Controller,
  UseGuards,
  Post,
  Req,
  Get,
  Redirect,
  Body,
  HttpCode,
  Res,
  UseFilters,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { BulkedUser } from '../users/users.type';
import { LocalAuthGuard } from './local/local-auth.guard';
import { LoginDto } from './dto/login-dto';
import { JwtAuthGuard } from './jwt-auth-guard';
import { NaverAuthGuard } from './naver/naver.auth.guard';
import { RedirectExceptionFilter } from 'src/filters/redirect-exception.filter';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  @Redirect('http://localhost:8080')
  googleAuthRedirect(@Req() req) {
    return this.authService.googleLogin(req);
  }

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
  async callback(@Req() req: Request, @Res() res: Response): Promise<any> {
    const { accessToken } = await this.authService.login(req.user);
    res.redirect(
      `http://192.168.35.247:8080/callback?accessToken=${accessToken}`,
    );
    return req.user;
  }

  @Get('naver/redirect')
  naverAuthRedirect(@Req() req: Request) {}
}
