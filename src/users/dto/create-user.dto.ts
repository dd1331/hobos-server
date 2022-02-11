import { User, RoleEnum } from '../entities/user.entity';
import { PartialType } from '@nestjs/mapped-types';
import { IsMobilePhone } from 'class-validator';

export class CreateUserDto extends PartialType(User) {
  userId?: string;
  userName?: string;
  password?: string;
  @IsMobilePhone('ko-KR')
  phone?: string;
  role?: RoleEnum;
}
