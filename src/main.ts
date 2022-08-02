import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/ko';
import { SimpleLoggingInterceptor } from './interceptors/simple-logging.interceptor';
import { NestExpressApplication } from '@nestjs/platform-express';
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Seoul');
dayjs.locale('ko');
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors(); // TODO temp
  app.useGlobalInterceptors(new SimpleLoggingInterceptor());
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
