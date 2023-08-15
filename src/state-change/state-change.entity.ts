import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class StateChange {
  @PrimaryGeneratedColumn()
  state_change_id: number;

  @Column()
  machine_name: string;

  @Column()
  start_time: Date;

  @Column()
  end_time: Date;

  @Column()
  status: string;

  @Column()
  reason_code: string;

  @Column()
  duration: number;
}
