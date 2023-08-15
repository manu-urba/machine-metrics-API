import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import StateChange from '../state-change/state-change.entity';
import { ConfigModule } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { StateChangeService } from './state-change.service';

describe('StateChangeService', () => {
  let stateChangeService: StateChangeService;
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
      providers: [StateChangeService],
    }).compile();

    stateChangeService = module.get<StateChangeService>(StateChangeService);
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
    expect(stateChangeService).toBeDefined();
  });

  it('should load sql dummy data file correctly', async () => {
    const stateChangeCount = await aggregateRepository.count();
    expect(stateChangeCount).toBeDefined();
  });

  it('should correctly find items', async () => {
    const result = await stateChangeService.findPaginated(
      { page: 1, perPage: 50 },
      {},
    );
    expect(result).toBeDefined();
    expect(result.data.length).toBe(50);
    expect(result.totalCount).toBeDefined();
    expect(result.totalCount).toBeGreaterThan(0);
    expect(result.data[0].status).toBeDefined();
    expect(result.hasPrevious).toBe(false);
    expect(result.hasNext).toBe(true);
  });

  it('should correctly find items with different pagination', async () => {
    const result = await stateChangeService.findPaginated(
      { page: 5, perPage: 3 },
      {},
    );
    expect(result).toBeDefined();
    expect(result.data.length).toBe(3);
    expect(result.totalCount).toBeDefined();
    expect(result.totalCount).toBeGreaterThan(0);
    expect(result.data[0].status).toBeDefined();
    expect(result.hasPrevious).toBe(true);
    expect(result.hasNext).toBe(true);
  });

  it('should correctly find items with machine name filter', async () => {
    const result = await stateChangeService.findPaginated(
      { page: 1, perPage: 2 },
      { machineName: 'Test1' },
    );
    expect(result).toBeDefined();
    expect(result.data.length).toBe(2);
    expect(result.totalCount).toBeDefined();
    expect(result.totalCount).toBeGreaterThan(0);
    expect(result.data[0].status).toBeDefined();
    expect(result.hasPrevious).toBe(false);
    expect(result.hasNext).toBe(true);
  });

  it('should correctly find items with invalid machine name filter', async () => {
    const result = await stateChangeService.findPaginated(
      { page: 1, perPage: 2 },
      { machineName: 'Test2' },
    );
    expect(result).toBeDefined();
    expect(result.data.length).toBe(0);
    expect(result.totalCount).toBe(0);
    expect(result.data[0]?.status).not.toBeDefined();
    expect(result.hasPrevious).toBe(false);
    expect(result.hasNext).toBe(false);
  });

  it('should correctly find items with date filter', async () => {
    const gtDate = new Date('2023-02-03T16:31:56.143Z');
    const ltDate = new Date('2023-04-05T12:31:56.143Z');
    const result = await stateChangeService.findPaginated(
      { page: 1, perPage: 2 },
      {
        startTime: {
          gt: gtDate,
          lt: ltDate,
        },
      },
    );
    expect(result).toBeDefined();
    expect(
      result.data[0].start_time < ltDate && result.data[0].start_time > gtDate,
    ).toBe(true);
  });
});
