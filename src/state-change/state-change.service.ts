import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import StateChange from './state-change.entity';
import {
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import StateChangeResponse from './state-change.response';
import PaginatedResponse from '../pagination/paginated.response';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';

@Injectable()
export class StateChangeService {
  constructor(
    @InjectRepository(StateChange)
    private stateChangeRepository: Repository<StateChange>,
  ) {}

  async findPaginated(
    pagination: {
      page: number;
      perPage: number;
    },
    filters: {
      machineName?: string;
      startTime?: {
        gt?: Date;
        gte?: Date;
        lt?: Date;
        lte?: Date;
      };
      endTime?: {
        gt?: Date;
        gte?: Date;
        lt?: Date;
        lte?: Date;
      };
    },
  ): Promise<PaginatedResponse<StateChangeResponse>> {
    const where: FindOptionsWhere<StateChange> = {};
    if (filters.machineName) where.machine_name = filters.machineName;
    if (filters.startTime?.gt)
      where.start_time = MoreThan(filters.startTime.gt);
    if (filters.startTime?.gte)
      where.start_time = MoreThanOrEqual(filters.startTime.gte);
    if (filters.startTime?.lt)
      where.start_time = LessThan(filters.startTime.lt);
    if (filters.startTime?.lte)
      where.start_time = LessThanOrEqual(filters.startTime.lte);
    if (filters.endTime?.gt) where.end_time = MoreThan(filters.endTime.gt);
    if (filters.endTime?.gte)
      where.end_time = MoreThanOrEqual(filters.endTime.gte);
    if (filters.endTime?.lt) where.end_time = LessThan(filters.endTime.lt);
    if (filters.endTime?.lte)
      where.end_time = LessThanOrEqual(filters.endTime.lte);
    const take = +pagination.perPage;
    const skip = (pagination.page - 1) * pagination.perPage;
    const result = await this.stateChangeRepository
      .createQueryBuilder()
      .where(where);
    const [data, totalCount] = await result
      .take(take)
      .skip(skip)
      .getManyAndCount();
    return {
      data,
      totalCount,
      hasNext: skip + take < totalCount,
      hasPrevious: skip > 0,
    };
  }
}
