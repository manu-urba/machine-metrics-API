import { Controller, Get, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { AggregateService } from './aggregate.service';
import {
  ApiHeader,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import AggregateResponse from './aggregate.response';
import { ApiKeyAuthGuard } from '../auth/guard/apikey-auth.guard';
import AggregatePaginatedResponse from './aggregate-paginated.response';

@UseGuards(ApiKeyAuthGuard)
@Controller('api')
export class AggregateController {
  constructor(private readonly aggregateService: AggregateService) {}

  @Get('aggregate')
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
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiHeader({
    name: 'api-key',
    required: true,
  })
  async getAggregate(
    @Query('machine') machineName: string,
  ): Promise<AggregateResponse> {
    return this.aggregateService.getUtilizationPercentage(machineName);
  }

  @Get('aggregate-multiple')
  @ApiOperation({
    summary: 'Get aggregated information for multiple machines.',
  })
  @ApiQuery({
    name: 'machine',
    description: 'Name of the machine.',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'utilization-from',
    description: 'Start date used to calculate utilization percentage.',
    type: Date,
    required: false,
  })
  @ApiQuery({
    name: 'utilization-to',
    description: 'End date used to calculate utilization percentage.',
    type: Date,
    required: false,
  })
  @ApiQuery({
    name: 'per_page',
    description: 'Number of items per page [MIN: 1 | MAX: 50].',
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: 'page',
    description: 'Number of page.',
    type: Number,
    required: false,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Aggregated information retrieved.',
    type: AggregatePaginatedResponse,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiHeader({
    name: 'api-key',
    required: true,
  })
  async getAggregateMultiple(
    @Query('page') page?: number,
    @Query('per_page') perPage?: number,
    @Query('machine') machineName?: string,
    @Query('utilization-from') utilizationFrom?: Date,
    @Query('utilization-to') utilizationTo?: Date,
  ): Promise<AggregatePaginatedResponse> {
    return this.aggregateService.getAggregateDataMultiple(
      {
        page: page ?? 1,
        perPage: perPage ?? (+process.env.PER_PAGE_MAXIMUM_ITEMS || 50),
      },
      machineName,
      {
        utilizationFrom,
        utilizationTo,
      },
    );
  }
}
