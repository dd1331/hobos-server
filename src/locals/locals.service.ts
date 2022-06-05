import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateLocalDto } from './dto/update-local.dto';
import axios from 'axios';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class LocalsService {
  constructor(
    @InjectRepository(Review) private readonly reviewRepo: Repository<Review>,
  ) {}
  private readonly logger = new Logger(LocalsService.name);
  private readonly URL =
    process.env.LOCAL_SERVICE_URL || 'http://localhost:4000';
  async createReview(dto: CreateReviewDto, user: User) {
    try {
      const { data } = await axios.post(`${this.URL}/reviews`, {
        ...dto,
        userId: user.id,
      });

      const { id } = await this.reviewRepo.save({
        reviewId: data.id,
        user,
        type: dto.type,
      });
      return { ...data, id };
    } catch (error) {
      return error.response.data;
    }
  }

  findAll() {
    return `This action returns all locals`;
  }

  findOne(id: number) {
    return `This action returns a #${id} local`;
  }

  update(id: number, updateLocalDto: UpdateLocalDto) {
    return `This action updates a #${id} local`;
  }

  async removeReview(id: number) {
    try {
      const review = await this.reviewRepo.findOne({ where: { id } });
      if (!review) throw new NotFoundException('리뷰가 존재하지 않습니다');
      review.deletedAt = new Date();

      await axios.delete(`${this.URL}/reviews/${review.reviewId}`);

      return await this.reviewRepo.save(review);
    } catch (error) {
      throw error;
    }
  }
}
