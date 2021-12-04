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
  async getLocalRankingByCity(take = 9): Promise<LocalRankingResult[]> {
    const cities = await this.adminDistrictRepo.find({
      where: { townCode: IsNull(), cityCode: Not(IsNull()) },
      take,
    });

    const result: LocalRankingResult[] = [];
    const promises = cities.map(async (city) => {
      const weather = await this.weatherRepo.findOne({
        where: { cityName: city.cityName },
      });

      result.push({ ...city, ...weather });

      return city;
    });

    await Promise.all(promises);

    return result;
  }
}
type LocalRankingResult = AdminDistrict & {
  o3Value: number;
  pm10Value: number;
  pm25Value: number;
  description: string;
  temp: number;
  feelsLike: number;
  humidity: number;
};
