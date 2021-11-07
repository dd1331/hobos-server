import { IsNotEmpty, IsOptional, IsArray, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Post } from '../entities/post.entity';

export class CreatePostDto extends PartialType(Post) {
  @IsString()
  @IsNotEmpty()
  poster: string;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  category: string;

  @IsOptional()
  url?: string;

  @IsOptional()
  fileId?: string;

  @IsOptional()
  @IsArray()
  hashtags?: string[];

  @IsOptional()
  createdAt?: Date;
}
