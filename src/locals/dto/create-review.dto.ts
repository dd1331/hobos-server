import { IsNotEmpty } from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty({ message: 'content 값이 존재하지 않습니다' })
  content: string;

  @IsNotEmpty({ message: 'cityCode 값이 존재하지 않습니다' })
  cityCode: string;
}
