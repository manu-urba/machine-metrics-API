import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiHeader } from '@nestjs/swagger';
import { ApiKeyAuthGuard } from '../auth/guard/apikey-auth.guard';
import { StateChangeService } from './state-change.service';

@UseGuards(ApiKeyAuthGuard)
@Controller('api/state-change')
export class StateChangeController {
  constructor(private readonly stateChangeService: StateChangeService) {}

  @Get('/')
  @ApiHeader({
    name: 'api-key',
    required: true,
  })
  async getStateChanges(): Promise<string> {
    return 'a';
  }
}
