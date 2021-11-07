import {
  Controller,
  UseGuards,
  Post,
  Req,
  Get,
  Redirect,
  Body,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { BulkedUser } from '../users/users.type';
import { LocalAuthGuard } from './local/local-auth.guard';
import { LoginDto } from './dto/login-dto';
import { JwtAuthGuard } from './jwt-auth-guard';

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
  @Post('/login')
  @HttpCode(200)
  login(@Body() dto: LoginDto, @Req() req) {
    return this.authService.login(req.user);
  }
  @UseGuards(JwtAuthGuard)
  @Get('/test')
  test(@Req() req) {}

  @Post('naver')
  @Redirect('http://192.168.35.123:3000/auth/naver/redirect')
  async naverLogin(@Body() user: BulkedUser, @Req() req) {
    // const res = await this.authService.naverLogin(user);
    // req.user = res;
    // return res;
  }

  @Get('naver/redirect')
  naverAuthRedirect(@Req() req: Request) {}
}
