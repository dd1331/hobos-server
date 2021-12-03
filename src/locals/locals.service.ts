import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminDistrict } from './entities/admin_district.entity';
import { Repository, Not, IsNull } from 'typeorm';

@Injectable()
export class LocalsService {
  constructor(
    @InjectRepository(AdminDistrict)
    private readonly adminDistrictRepo: Repository<AdminDistrict>,
  ) {}
  async getLocalRankingByCity() {
    return await this.adminDistrictRepo.find({
      where: { townCode: IsNull(), cityCode: Not(IsNull()) },
    });
  }
}
