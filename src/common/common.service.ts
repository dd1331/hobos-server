import { Injectable } from '@nestjs/common';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CommonService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async getCategories(type): Promise<Partial<Category>[]> {
    const temp = [
      { title: 'free' },
      { title: 'exercise' },
      { title: 'environment' },
      { title: 'news' },
      { title: 'meetup' },
    ];
    return temp;
    // return await this.categoryRepo.find({ where: { type } });
  }
}
