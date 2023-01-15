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
  user_id: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'author_id' })
  user: User;

  @Column()
  market: string;

  @Column()
  active: boolean;

  @Column()
  direction: string;

  @Column()
  entry_order_one: number;

  @Column({ nullable: true })
  entry_order_two: number;

  @Column({ nullable: true })
  entry_order_three: number;

  @Column()
  take_profit_one: number;

  @Column({ nullable: true })
  take_profit_two: number;

  @Column()
  stop: number;

  @Column({ nullable: true })
  result: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default TradeOperation;
