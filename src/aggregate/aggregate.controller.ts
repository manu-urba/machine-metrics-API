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
}
