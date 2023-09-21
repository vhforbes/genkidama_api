/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

// Decorator => A classe é um parametro sendo passado para o decorator Entity
@Entity('liveStatus')
class LiveStatus {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  live: boolean;
}

export default LiveStatus;
