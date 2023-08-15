import { Controller, Get, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { ApiHeader, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { ApiKeyAuthGuard } from '../auth/guard/apikey-auth.guard';
import { StateChangeService } from './state-change.service';
import StateChangeResponse from './state-change.response';

@UseGuards(ApiKeyAuthGuard)
@Controller('api/state-change')
export class StateChangeController {
  constructor(private readonly stateChangeService: StateChangeService) {}

  @Get('/')
  @ApiHeader({
    name: 'api-key',
    required: true,
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
    type: StateChangeResponse,
    isArray: true,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  async getStateChanges(
    @Query('page') page: number,
    @Query('per_page') perPage: number,
  ): Promise<StateChangeResponse[]> {
    return this.stateChangeService.findPaginated({
      page: page ?? 1,
      perPage: perPage ?? (+process.env.PER_PAGE_MAXIMUM_ITEMS || 50),
    });
  }
}
