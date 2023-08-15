import { ApiProperty } from '@nestjs/swagger';

export default class AggregateResponse {
  @ApiProperty()
  machine: string;

  @ApiProperty()
  utilization: number;
}
