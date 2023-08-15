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
    const take = +pagination.perPage;
    const skip = (pagination.page - 1) * pagination.perPage;
    const result = await this.stateChangeRepository
      .createQueryBuilder()
      .where(where);
    const totalCount = await result.getCount();
    const data = await result.take(take).skip(skip).execute();
    return {
      data,
      totalCount,
      hasNext: skip + take < totalCount,
      hasPrevious: skip > 0,
    };
  }
}
