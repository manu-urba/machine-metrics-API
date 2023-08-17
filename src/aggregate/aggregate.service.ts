import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import StateChange from '../state-change/state-change.entity';
import AggregateResponse from './aggregate.response';
import AggregatePaginatedResponse from './aggregate-paginated.response';

@Injectable()
export class AggregateService {
  constructor(
    @InjectRepository(StateChange)
    private stateChangeRepository: Repository<StateChange>,
  ) {}

  async getUtilizationPercentage(
    machineName: string,
  ): Promise<AggregateResponse> {
    const queryBuilder = this.stateChangeRepository
      .createQueryBuilder('state_change')
      .select(
        'SUM(CASE WHEN state_change.status = :operational THEN state_change.duration ELSE 0 END)',
        'operational_duration',
      )
      .addSelect(
        'SUM(CASE WHEN state_change.status = :nonOperational THEN state_change.duration ELSE 0 END)',
        'non_operational_duration',
      )
      .where('state_change.machine_name = :machineName', { machineName })
      .setParameters({
        operational: 'operational',
        nonOperational: 'non_operational',
      });

    const { operational_duration, non_operational_duration } =
      await queryBuilder.getRawOne();

    const operationalHours = (operational_duration || 0) / 3600;
    const nonOperationalHours = (non_operational_duration || 0) / 3600;
    const utilization =
      (operationalHours / (operationalHours + nonOperationalHours)) * 100;
    return { machine: machineName, utilization };
  }

  async getAggregateDataMultiple(
    pagination: {
      page: number;
      perPage: number;
    },
    machineName?: string,
    utilizationFilter?: { utilizationFrom?: Date; utilizationTo?: Date },
  ): Promise<AggregatePaginatedResponse> {
    const take = +pagination.perPage;
    const skip = (pagination.page - 1) * pagination.perPage;
    const queryBuilder = this.stateChangeRepository
      .createQueryBuilder('state_change')
      .select([
        'state_change.machine_name AS state_change_machine_name',
        `(SUM(CASE WHEN state_change.status = 'operational' THEN state_change.duration ELSE 0 END) / 3600.0) / 
       (SUM(CASE WHEN state_change.status = 'operational' THEN state_change.duration ELSE 0 END) / 3600.0 + 
        SUM(CASE WHEN state_change.status = 'non_operational' THEN state_change.duration ELSE 0 END) / 3600.0) AS formula_result`,
      ])
      .where('state_change.start_time >= :utilizationFrom', {
        utilizationFrom: utilizationFilter.utilizationFrom ?? new Date(0),
      })
      .andWhere('state_change.end_time <= :utilizationTo', {
        utilizationTo: utilizationFilter.utilizationTo ?? new Date(2100, 1),
      })
      .andWhere(machineName ? 'machine_name = :machineName' : '1 = 1', {
        machineName,
      })
      .groupBy('state_change.machine_name')
      .orderBy('formula_result', 'DESC')
      .skip(skip)
      .take(take);
    const data = await queryBuilder.getRawMany();
    const totalCountQuery = this.stateChangeRepository
      .createQueryBuilder('state_change')
      .select('COUNT(DISTINCT state_change.machine_name)', 'totalCount')
      .where('state_change.start_time >= :utilizationFrom', {
        utilizationFrom: utilizationFilter.utilizationFrom ?? new Date(0),
      })
      .andWhere('state_change.end_time <= :utilizationTo', {
        utilizationTo: utilizationFilter.utilizationTo ?? new Date(2100, 1),
      });

    const [{ totalCount }] = await totalCountQuery.getRawMany();
    return {
      data: data.map((d) => {
        return {
          machine: d.state_change_machine_name,
          utilization: d.formula_result * 100,
        };
      }),
      totalCount: totalCount,
      hasNext: skip + take < totalCount,
      hasPrevious: skip > 0,
    };
  }
}
