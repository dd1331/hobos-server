import { IsNotEmpty, IsInt } from 'class-validator';

export class CreateCommentDto {
  @IsInt()
  postId: number;

  @IsInt()
  commenterId: number;

  @IsNotEmpty()
  content: string;
}
