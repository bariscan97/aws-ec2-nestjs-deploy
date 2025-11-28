import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-ioredis-yet';

import { Product } from './product.entity';
import { ProductRepository } from './product.repository';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { S3Module } from '../s3/s3.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        store: await redisStore({
          host: configService.get('redis.host'),
          port: configService.get('redis.port'),
          ttl: configService.get('redis.ttl') * 1000,
        }),
      }),
      inject: [ConfigService],
    }),
    S3Module,
  ],
  providers: [ProductRepository, ProductService],
  controllers: [ProductController],
  exports: [ProductRepository, ProductService],
})
export class ProductModule { }

