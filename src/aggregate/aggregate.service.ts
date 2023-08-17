import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import StateChange from '../state-change/state-change.entity';
import AggregateResponse from './aggregate.response';

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
}
