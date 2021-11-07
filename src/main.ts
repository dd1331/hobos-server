import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/ko';
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Seoul');
dayjs.locale('ko');
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // TODO temp
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
