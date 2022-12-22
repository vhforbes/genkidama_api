/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import User from './User';

@Entity('tradeOperations')
class TradeOperation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  author_id: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'author_id' })
  user: User;

  @Column()
  market: string;

  @Column()
  status: string;

  @Column()
  direction: string;

  @Column()
  entryZone: {
    begin: number;
    end: number;
  };

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default TradeOperation;
