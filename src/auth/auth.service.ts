import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { Request } from 'express';
import { BulkedUser } from '../users/users.type';
import * as bcript from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {} //readonly?

  googleLogin(req: Request) {
    if (!req.user) {
      return 'No user from google';
    }

    return {
      message: 'User information from google',
      user: req.user,
    };
  }
  // async naverLogin(naver: BulkedUser): Promise<BulkedUser> {
  //   const accessToken = naver.accessToken;
  //   const user = await this.getUserBySocial(naver.naverId, 'naver', 'naverId');

  //   if (!user) {
  //     return {
  //       ...(await this.signupWithSns(naver.naverId, 'naver', 'naverId')),
  //       accessToken,
  //     };
  //   }
  //   console.log(user);

  //   return { ...user, accessToken };
  // }

  async validateUser(phone: string, password: string): Promise<User> {
    const user = await this.usersService.getUserByPhone(phone);
    const isEqual = await bcript.compare(password, user.password);
    if (user && isEqual) {
      return user;
    }
    return null;
  }
  async login(user: any): Promise<BulkedUser> {
    const payload = { id: user.id };
    return { ...user, accessToken: this.jwtService.sign(payload) };
  }

  // async getUserBySocial(id: string, provider: string, column: string) {
  //   const where = { provider, [column]: id };

  //   return await this.userRepo.findOne({
  //     where,
  //   });
  // }

  // async signupWithSns(
  //   id: string,
  //   provider: string,
  //   socialId: string,
  // ): Promise<User> {
  //   const createUserDto: CreateUserDto = {
  //     provider: provider,
  //     password: 'randomString',
  //     phone: 'randomPhone',
  //     userId: 'randomString',
  //     userName: 'randomString',
  //     [socialId]: id,
  //   };
  //   const user = await this.userRepo.create(createUserDto);

  //   return await this.userRepo.save(user);
  // }
}
