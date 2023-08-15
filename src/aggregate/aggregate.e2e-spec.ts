import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AggregateModule } from './aggregate.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import StateChange from './state-change/state-change.entity';
import { AuthModule } from '../auth/auth.module';

describe('ReaderController (e2e)', () => {
  let app: INestApplication;
  let configService: ConfigService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: ['.env.local.test'],
        }),
        TypeOrmModule.forRoot({
          type: 'mssql',
          host: process.env.DATABASE_HOST,
          port: +process.env.DATABASE_PORT,
          username: process.env.DATABASE_USERNAME,
          password: process.env.DATABASE_PASSWORD,
          database: process.env.DATABASE_DBNAME,
          entities: [StateChange],
          synchronize: true,
          extra: {
            trustServerCertificate: true,
            Encrypt: true,
            IntegratedSecurity: false,
          },
        }),
        TypeOrmModule.forFeature([StateChange]),
        AggregateModule,
        AuthModule,
      ],
    }).compile();

    app = module.createNestApplication();
    configService = module.get<ConfigService>(ConfigService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/aggregate (GET) should throw unauthorized error if api key not provided', async () => {
    const response = await request(app.getHttpServer()).get(
      '/api/aggregate?machine=Test1',
    );
    expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
  });

  it('/aggregate (GET) should return valid data', async () => {
    const validApiKey = configService
      .get<string>('ALLOWED_API_KEYS')
      .split(',')[0];
    const server = app.getHttpServer();
    const response = await request(server)
      .get('/api/aggregate?machine=Test1')
      .set('api-key', validApiKey);
    expect(response.status).toEqual(HttpStatus.OK);
  });
});
