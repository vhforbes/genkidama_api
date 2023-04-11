/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
} from 'typeorm';
import TradeOperation from './TradeOperation';
import User from './User';

@Entity('tradeOperationsHistory')
export class TradeOperationHistory extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  author_id: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'author_id' })
  user: User;

  @Column()
  market: string;

  @Column({
    type: 'varchar',
    length: 10,
    enum: ['aguardando', 'ativa', 'fechada'],
  })
  status: string;

  @Column()
  direction: string;

  @Column({ nullable: true })
  observation: string;

  // -------- VALUES --------
  @Column({ type: 'float' })
  entry_order_one: number;

  @Column({ nullable: true, type: 'float' })
  entry_order_two: number;

  @Column({ nullable: true, type: 'float' })
  entry_order_three: number;

  @Column({ type: 'float' })
  take_profit_one: number;

  @Column({ nullable: true, type: 'float' })
  take_profit_two: number;

  @Column({ type: 'float' })
  stop: number;

  // -------- RESULTS --------
  @Column({ nullable: true })
  result: string;

  @Column({ type: 'float', nullable: true })
  percentual: number;

  // -------- OTHERS --------
  @Column({ default: 30 })
  maxFollowers: number;

  @Column('simple-array', { nullable: true })
  followers: number[];

  @Column({ nullable: true })
  tradingViewLink: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @Column({ default: 1 })
  version: number;

  // -------- JOIN PARENT --------
  @ManyToOne(() => TradeOperation, tradeOperation => tradeOperation.history, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'tradeOperationId' })
  tradeOperation: TradeOperation;
}
