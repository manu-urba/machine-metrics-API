import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import { AggregateService } from './aggregate.service';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import AggregateResponse from './aggregate.response';

@Controller('api/aggregate')
export class AggregateController {
  constructor(private readonly aggregateService: AggregateService) {}

  @Get()
  @ApiOperation({
    summary: 'Get aggregated information for a specific machine.',
  })
  @ApiQuery({
    name: 'machine',
    description: 'Name of the machine.',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Aggregated information retrieved.',
    type: AggregateResponse,
  })
  async getAggregate(
    @Query('machine') machineName: string,
  ): Promise<AggregateResponse> {
    return this.aggregateService.getUtilizationPercentage(machineName);
  }
}
