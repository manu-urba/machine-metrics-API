import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import StateChange from './state-change.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StateChangeService {
  constructor(
    @InjectRepository(StateChange)
    private stateChangeRepository: Repository<StateChange>,
  ) {}
}
