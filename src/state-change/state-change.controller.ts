import { Controller, Get, HttpStatus, Query, UseGuards } from '@nestjs/common';
import {
  ApiHeader,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { ApiKeyAuthGuard } from '../auth/guard/apikey-auth.guard';
import { StateChangeService } from './state-change.service';
import StateChangeResponse from './state-change.response';
import PaginatedResponse from '../pagination/paginated.response';
import StateChangePaginatedResponse from './state-change-paginated.response';

@UseGuards(ApiKeyAuthGuard)
@Controller('api/state-change')
export class StateChangeController {
  constructor(private readonly stateChangeService: StateChangeService) {}

  @Get('/')
  @ApiOperation({
    summary: 'Get state change data.',
  })
  @ApiHeader({
    name: 'api-key',
    required: true,
  })
  @ApiQuery({
    name: 'start_time_gt',
    type: Date,
    required: false,
  })
  @ApiQuery({
    name: 'start_time_gte',
    type: Date,
    required: false,
  })
  @ApiQuery({
    name: 'start_time_lt',
    type: Date,
    required: false,
  })
  @ApiQuery({
    name: 'start_time_lte',
    type: Date,
    required: false,
  })
  @ApiQuery({
    name: 'machine_name',
    type: String,
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
    description: 'State changes information retrieved.',
    type: StateChangePaginatedResponse,
    isArray: true,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  async getStateChanges(
    @Query('page') page?: number,
    @Query('per_page') perPage?: number,
    @Query('machine_name') machineName?: string,
    @Query('start_time_gt') startTimeGt?: Date,
    @Query('start_time_gte') startTimeGte?: Date,
    @Query('start_time_lt') startTimeLt?: Date,
    @Query('start_time_lte') startTimeLte?: Date,
  ): Promise<PaginatedResponse<StateChangeResponse>> {
    return this.stateChangeService.findPaginated(
      {
        page: page ?? 1,
        perPage: perPage ?? (+process.env.PER_PAGE_MAXIMUM_ITEMS || 50),
      },
      {
        machineName,
        startTime: {
          gt: startTimeGt,
          gte: startTimeGte,
          lt: startTimeLt,
          lte: startTimeLte,
        },
      },
    );
  }
}
