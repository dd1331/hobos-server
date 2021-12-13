import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdatePostDto {
  @IsNumber()
  @IsNotEmpty()
  poster: number;

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
