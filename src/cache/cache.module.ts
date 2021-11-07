// import { Module, CacheModule } from '@nestjs/common';
// import * as redisStore from 'cache-manager-redis-store';
// import { CacheService } from './cache.service';
// import { CacheController } from './cache.controller';

// @Module({
//   imports: [
//     CacheModule.register({
//       // store: redisStore,
//       store: redisStore.create({
//         host: process.env.REDIS_HOST || 'localhost',
//         port: process.env.REDIS_PORT || 6379,
//         password: process.env.REDIS_PASSWORD,
//       }),
//       // host: 'redis-server',
//       // host: 'localhost',
//       host: process.env.REDIS_HOST || 'localhost',
//       port: process.env.REDIS_PORT || 6379,
//     }),
//   ],
//   controllers: [CacheController],
//   providers: [CacheService],
//   exports: [
//     CacheService,
//     CacheModule.register({
//       // store: redisStore,
//       store: redisStore.create({
//         host: process.env.REDIS_HOST || 'localhost',
//         port: process.env.REDIS_PORT || 6379,
//         password: process.env.REDIS_PASSWORD,
//       }),
//       // host: 'redis-server',
//       // host: 'localhost',
//       host: process.env.REDIS_HOST || 'localhost',
//       port: process.env.REDIS_PORT || 6379,
//     }),
//   ],
// })
// export class RedisCacheModule {}
