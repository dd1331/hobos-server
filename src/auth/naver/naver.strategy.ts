import { Strategy } from 'passport-naver';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/users.service';

@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      clientID: process.env.NAVER_CLIENT_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET,
      callbackURL: process.env.OAUTH_CALLBACK_URL,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<any> {
    const { id, provider } = profile;
    const user = await this.usersService.getUserByNaverId(id);
    if (!user) {
      const user = await this.usersService.createByNaverId({
        provider,
        naverId: profile.id,
      });
      return user;
      // throw new UnauthorizedException();
    }
    return user;
  }
}
