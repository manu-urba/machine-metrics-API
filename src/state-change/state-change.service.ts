import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import StateChange from './state-change.entity';
import { Repository } from 'typeorm';
import StateChangeResponse from './state-change.response';

@Injectable()
export class StateChangeService {
  constructor(
    @InjectRepository(StateChange)
    private stateChangeRepository: Repository<StateChange>,
  ) {}

  async findPaginated(pagination: {
    page: number;
    perPage: number;
  }): Promise<StateChangeResponse[]> {
    const take = pagination.perPage;
    const skip = (pagination.page - 1) * pagination.perPage;
    const result = await this.stateChangeRepository
      .createQueryBuilder()
      .where({})
      .take(take)
      .skip(skip);
    return result.execute();
  }
}
