import { IsNotEmpty, IsOptional, IsArray, IsNumber } from 'class-validator';
import { PostCategory } from '../entities/post.entity';

export class CreatePostDto {
  @IsNumber()
  @IsNotEmpty()
  poster: number;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  category: PostCategory;

  @IsOptional()
  url?: string;

  @IsOptional()
  fileId?: number;

  @IsOptional()
  @IsArray()
  hashtags?: string[];

  @IsOptional()
  createdAt?: Date;
}
