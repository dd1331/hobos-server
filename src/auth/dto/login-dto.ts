import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsNotEmpty } from 'class-validator';
import { User } from '../../users/entities/user.entity';

export class LoginDto extends PartialType(User) {
  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  phone: string;
}
