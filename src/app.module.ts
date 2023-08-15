import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AggregateModule } from './aggregate/aggregate.module';
import * as Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import * as path from 'path';
import { StateChangeModule } from './state-change/state-change.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env.development'],
      validationSchema: Joi.object({
        PORT: Joi.number().default(3000),
        DATABASE_HOST: Joi.string().required(),
        DATABASE_PORT: Joi.number().required(),
        DATABASE_USERNAME: Joi.string().required(),
        DATABASE_PASSWORD: Joi.string().required(),
        DATABASE_DBNAME: Joi.string().required(),
        API_VERSION: Joi.string().required(),
        ALLOWED_API_KEYS: Joi.string().required(),
        PER_PAGE_MAXIMUM_ITEMS: Joi.number().default(50),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DBNAME,
      entities: [path.join(__dirname, '**', '*.entity.{ts,js}')],
      synchronize: false,
      extra: {
        trustServerCertificate: true,
        Encrypt: true,
        IntegratedSecurity: false,
      },
    }),
    AggregateModule,
    AuthModule,
    StateChangeModule,
  ],
})
export class AppModule {}
