import { Injectable, Logger } from '@nestjs/common';
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
  async createReview(dto: CreateReviewDto, user: User) {
    try {
      const URL = process.env.LOCAL_SERVICE_URL || 'http://localhost:4000';
      const { data } = await axios.post(`${URL}/reviews`, {
        ...dto,
        userId: user.id,
      });

      await this.reviewRepo.save({ reviewId: data.id, user, type: dto.type });

      return data;
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

  remove(id: number) {
    return `This action removes a #${id} local`;
  }
}
