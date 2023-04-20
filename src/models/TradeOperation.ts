/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BaseEntity,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import User from './User';
import TradeOperationHistory from './TradeOperationHistory';

@Entity('tradeOperations')
class TradeOperation extends BaseEntity {
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
  @Column({ nullable: true })
  tradingViewLink: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @Column({ default: 1 })
  version: number;

  // -------- JOIN HISTORY --------
  @OneToMany(
    () => TradeOperationHistory,
    (history: any) => history.tradeOperation,
  )
  history: TradeOperationHistory[];

  // -------- FOLLOWERS --------
  @Column({ default: 30 })
  maxFollowers: number;

  @ManyToMany(() => User, user => user.tradeOperations)
  @JoinTable()
  users: User[];
}

export default TradeOperation;
