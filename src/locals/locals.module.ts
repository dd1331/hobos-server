import { Module } from '@nestjs/common';
import { LocalsService } from './locals.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminDistrict } from './entities/admin_district.entity';
import { Weather } from './entities/weather.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AdminDistrict, Weather])],
  providers: [LocalsService],
})
export class LocalsModule {}
