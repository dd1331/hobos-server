import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminDistrict } from './entities/admin_district.entity';
import { Repository, Not, IsNull } from 'typeorm';
import { Weather } from './entities/weather.entity';

@Injectable()
export class LocalsService {
  constructor(
    @InjectRepository(AdminDistrict)
    private readonly adminDistrictRepo: Repository<AdminDistrict>,
    @InjectRepository(Weather)
    private readonly weatherRepo: Repository<Weather>,
  ) {}
  async getLocalRankingByCity(take = 9) {
    const cities = await this.adminDistrictRepo.find({
      where: { townCode: IsNull(), cityCode: Not(IsNull()) },
      take,
    });
    const result = [];
    const promises = cities.map(async (city) => {
      const { o3Value, pm10Value, pm25Value } = await this.weatherRepo.findOne({
        where: { cityName: city.cityName },
      });
      result.push({ ...city, o3Value, pm10Value, pm25Value });
      return city;
    });
    await Promise.all(promises);
    console.log(result);
    return result;
  }
}
