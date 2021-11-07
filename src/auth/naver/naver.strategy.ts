import { Injectable, Res, Body } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-naver';
import { AuthService } from '../auth.service';
import { BulkedUser } from '../../users/users.type';

@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor(private authService: AuthService) {
    super({
      clientID: 'ag_B0_vLXpvrgG1J5Upp',
      callbackURL: 'http://192.168.35.123:3000/',
      clientSecret: 'hE0MnzlWWk',
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<BulkedUser> {
    const user = { naverId: profile.id, accessToken };
    return user;
  }
}
