import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import configuration from './config/configuration';
import { ProductModule } from './product/product.module';
import { S3Module } from './s3/s3.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'postgres',
          host: config.get<string>('database.host'),
          port: config.get<number>('database.port'),
          username: config.get<string>('database.user'),
          password: config.get<string>('database.password'),
          database: config.get<string>('database.name'),
          autoLoadEntities: true,
          synchronize: true, // prod: false, migration kullan
          ssl: config.get<string>('database.host') === 'postgres' ? false : {
            rejectUnauthorized: false, // RDS sslmode=require için
          },
          extra: {
            max: 3,
            idleTimeoutMillis: 10_000,
          },
        };
      },
    }),

    S3Module,
    ProductModule,
  ],
})
export class AppModule { }
