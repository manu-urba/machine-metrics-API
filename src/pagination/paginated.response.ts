import { ApiProperty } from '@nestjs/swagger';

export default class PaginatedResponse<T> {
  @ApiProperty()
  data: T[];

  @ApiProperty()
  hasNext: boolean;

  @ApiProperty()
  hasPrevious: boolean;

  @ApiProperty()
  totalCount: number;
}
