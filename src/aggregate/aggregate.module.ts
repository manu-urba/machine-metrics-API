import { Module } from '@nestjs/common';
import { AggregateController } from './aggregate.controller';
import { AggregateService } from './aggregate.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import StateChange from './state-change/state-change.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StateChange])],
  providers: [AggregateService],
  controllers: [AggregateController],
})
export class AggregateModule {}
