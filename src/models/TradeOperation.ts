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
    enum: ['aguardando', 'ativa', 'fechada', 'cancelada'],
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

  @Column({ type: 'float', nullable: true })
  stopDistance: number;

  // -------- RESULTS --------
  @Column({ nullable: true })
  result: string;

  @Column({ type: 'float', nullable: true })
  percentual: number;

  @Column('float', { nullable: true })
  riskReturnRatio: number | null;

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

  @Column({ default: 0 })
  currentFollowers: number;

  @ManyToMany(() => User)
  @JoinTable()
  users: User[];

  @Column('json', {
    nullable: true,
    default: () => "'{}'",
    comment: 'JSON column to store the status of entry orders',
  })
  entryOrdersStatus: {
    entryOrderOneTriggered?: boolean;
    entryOrderTwoTriggered?: boolean;
    entryOrderThreeTriggered?: boolean;
  };

  @Column('json', {
    nullable: true,
    default: () => "'{}'",
    comment: 'JSON column to store the status of entry orders',
  })
  takeProfitStatus: {
    takeProfitOneTriggered?: boolean;
    takeProfitTwoTriggered?: boolean;
    takeProfitThreeTriggered?: boolean;
  };
}

export default TradeOperation;
