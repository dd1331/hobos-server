import { IsInt } from 'class-validator';
import { CreateCommentDto } from './create-comment-dto';

export class CreateChildCommentDto extends CreateCommentDto {
  @IsInt()
  parentId: number;
}
