import { User } from '../entities/user.entity';
import { PartialType } from '@nestjs/mapped-types';

export class CreateUserDto extends PartialType(User) {
  userId?: string;
  userName?: string;
  password: string;
  phone: string;
  provider?: string;
  naverId?: string;
  role?: string;
}
