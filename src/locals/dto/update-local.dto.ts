import { PartialType } from '@nestjs/mapped-types';
import { CreateReviewDto } from './create-review.dto';

export class UpdateLocalDto extends PartialType(CreateReviewDto) {}
