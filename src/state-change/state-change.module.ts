import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import StateChange from '../state-change/state-change.entity';
import { StateChangeService } from './state-change.service';
import { StateChangeController } from './state-change.controller';

@Module({
  imports: [TypeOrmModule.forFeature([StateChange])],
  providers: [StateChangeService],
  controllers: [StateChangeController],
})
export class StateChangeModule {}
