import { ApiProperty } from '@nestjs/swagger';
import PaginatedResponse from '../pagination/paginated.response';
import AggregateResponse from './aggregate.response';

export default class AggregatePaginatedResponse
  implements PaginatedResponse<AggregateResponse>
{
  @ApiProperty({
    type: AggregateResponse,
    isArray: true,
  })
  data: AggregateResponse[];

  @ApiProperty()
  hasNext: boolean;

  @ApiProperty()
  hasPrevious: boolean;

  @ApiProperty()
  totalCount: number;
}
