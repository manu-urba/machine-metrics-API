import { ApiProperty } from '@nestjs/swagger';

export default class AggregateResponse {
  @ApiProperty()
  machine: string;

  @ApiProperty({
    required: false,
    description:
      'Machine utilization (%), if no data is available utilization equals to null',
  })
  utilization: number;
}
