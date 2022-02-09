import { Injectable } from '@nestjs/common';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostCategory } from '../posts/entities/post.entity';

@Injectable()
export class CommonService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async getCategories(type): Promise<Partial<Category>[]> {
    const categories = await this.categoryRepo.find({ where: { type } });

    if (!categories.length) return await this.initializeCategory(type);

    return categories;
  }
  private async initializeCategory(type) {
    const titles: PostCategory[] = ['free', 'meetup', 'investment', 'fire'];
    const promises = titles.map((title) =>
      this.categoryRepo.save({ type, title }),
    );
    return await Promise.all(promises);
  }
}
