import { IsInt, IsNotEmpty } from 'class-validator';

export class UpdateCommentDto {
  @IsInt()
  id: number;

  @IsNotEmpty()
  content: string;
}
