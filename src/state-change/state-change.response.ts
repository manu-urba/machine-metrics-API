import { ApiProperty } from '@nestjs/swagger';

export default class StateChangeResponse {
  @ApiProperty()
  state_change_id: number;

  @ApiProperty()
  machine_name: string;

  @ApiProperty()
  start_time: Date;

  @ApiProperty()
  end_time: Date;

  @ApiProperty()
  status: string;

  @ApiProperty()
  reason_code: string;

  @ApiProperty()
  duration: number;
}
