import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { BulkedUser } from '../users/users.type';
import * as bcript from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateLocalUser(phone: string, password: string): Promise<User> {
    const user = await this.usersService.getUserByPhone(phone);

    if (!user) throw new NotFoundException('회원정보가 일치하지 않습니다');

    const isEqual = await bcript.compare(password, user.password);

    if (user && isEqual) return user;

    throw new NotFoundException('회원정보가 일치하지 않습니다');
  }
  async login(user: User): Promise<BulkedUser> {
    const payload = { id: user.id };
    return { ...user, accessToken: this.jwtService.sign(payload) };
  }
}
