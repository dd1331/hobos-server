import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdatePostDto {
  @IsString()
  @IsNotEmpty()
  poster: string;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  content: string;

  @IsNumber()
  id: number;

  @IsOptional()
  url?: string;

  @IsOptional()
  fileId?: string;
}
