import { CreateUserDto } from './create-user.dto';

export class CreateUserNaverDto extends CreateUserDto {
  provider: string;
  naverId: string;
}
