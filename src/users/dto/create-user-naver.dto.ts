import { CreateUserDto } from './create-user.dto';
import { ProviderEnum } from '../entities/user.entity';

export class CreateUserNaverDto extends CreateUserDto {
  provider: ProviderEnum;
  naverId: string;
}
