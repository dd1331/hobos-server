import { IsNotEmpty, IsOptional, IsArray, IsNumber } from 'class-validator';

export class CreatePostDto {
  @IsNumber()
  @IsNotEmpty()
  poster: number;

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
