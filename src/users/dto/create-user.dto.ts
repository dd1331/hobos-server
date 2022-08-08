import { IsMobilePhone } from 'class-validator';
import { RoleEnum } from '../entities/user.entity';

export class CreateUserDto {
  userId?: string;
  userName?: string;
  password?: string;
  @IsMobilePhone('ko-KR')
  phone?: string;
  role?: RoleEnum;
}
