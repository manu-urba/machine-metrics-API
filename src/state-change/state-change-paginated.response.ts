import { ApiProperty } from '@nestjs/swagger';
import PaginatedResponse from '../pagination/paginated.response';
import StateChange from './state-change.entity';
import StateChangeResponse from './state-change.response';

export default class StateChangePaginatedResponse
  implements PaginatedResponse<StateChange>
{
  @ApiProperty({
    type: StateChangeResponse,
    isArray: true,
  })
  data: StateChangeResponse[];

  @ApiProperty()
  hasNext: boolean;

  @ApiProperty()
  hasPrevious: boolean;

  @ApiProperty()
  totalCount: number;
}
