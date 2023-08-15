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
    const operationalDuration = await this.getDuration(
      machineName,
      'operational',
    );
    const nonOperationalDuration = await this.getDuration(
      machineName,
      'non_operational',
    );
    const operationalHours = operationalDuration / 3600;
    const nonOperationalHours = nonOperationalDuration / 3600;
    const utilization =
      (operationalHours / (operationalHours + nonOperationalHours)) * 100;
    return { machine: machineName, utilization };
  }

  private async getDuration(
    machineName: string,
    status: string,
  ): Promise<number> {
    const duration = await this.stateChangeRepository.sum('duration', {
      machine_name: machineName,
      status,
    });
    return duration ?? 0;
  }
}
