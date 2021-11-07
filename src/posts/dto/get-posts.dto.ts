import { IsOptional, IsString, IsNumberString } from 'class-validator';

export class GetPostsDto {
  @IsOptional()
  @IsString()
  category: string;
  // TODO check if query send values only in string foramt
  // how to set default value for dto
  @IsOptional()
  @IsNumberString()
  page?: number;

  @IsOptional()
  @IsNumberString()
  take?: number;

  @IsOptional()
  @IsNumberString()
  hashtagId?: number;

  @IsOptional()
  @IsString()
  hashtagTitle?: string;

  @IsOptional()
  @IsString()
  keyword?: string;
}
