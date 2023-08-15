import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { AggregateService } from './aggregate.service';
import StateChange from '../state-change/state-change.entity';
import { ConfigModule } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import AggregateResponse from './aggregate.response';

describe('AggregateService', () => {
  let aggregateService: AggregateService;
  let entityManager: EntityManager;
  let aggregateRepository: Repository<StateChange>;

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
      ],
      providers: [AggregateService],
    }).compile();

    aggregateService = module.get<AggregateService>(AggregateService);
    entityManager = module.get<EntityManager>(EntityManager);
    aggregateRepository = module.get<Repository<StateChange>>(
      getRepositoryToken(StateChange),
    );
  });

  beforeEach(async () => {
    await aggregateRepository.delete({});
    const sqlFileContents = fs.readFileSync(
      path.join(__dirname, '..', '..', 'sql-dummy-data.sql'),
      'utf-8',
    );
    if (!sqlFileContents) throw new Error("Couldn't read sql dummy file");
    await entityManager.query(sqlFileContents);
  });

  it('should be defined', () => {
    expect(aggregateService).toBeDefined();
  });

  it('should load sql dummy data file correctly', async () => {
    const stateChangeCount = await aggregateRepository.count();
    expect(stateChangeCount).toBeDefined();
  });

  it('should return correct value for aggregate function', async () => {
    const utilizationPercentage =
      await aggregateService.getUtilizationPercentage('Test1');
    expect(utilizationPercentage).toMatchObject<AggregateResponse>({
      machine: 'Test1',
      utilization: 17.67587975905698,
    });
  });
});
