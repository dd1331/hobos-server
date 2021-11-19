import { Strategy } from 'passport-naver';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      clientID: '4yYQ9GQnL3sH0JOpPXpS',
      clientSecret: 'pYzHZT10jJ',
      callbackURL: 'http://192.168.35.247:3000/auth/naver/callback',
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
      // const user = await this.usersService.createByNaverId({
      //   provider,
      //   naverId: profile.id,
      // });
      // return user;
      throw new UnauthorizedException();
    }
    return user;
  }
}
