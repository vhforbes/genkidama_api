/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import Subscription from './Subscription';
import TradeOperation from './TradeOperation';

// Decorator => A classe é um parametro sendo passado para o decorator Entity
@Entity('users')
class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ nullable: true })
  bitgetUID: string;

  @Column({ nullable: true })
  role: string;

  @Column({ nullable: true })
  subscription_id: string;

  @OneToOne(() => Subscription, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'subscription_id' })
  subscription: Subscription;

  @Column({ default: false })
  verified: boolean;

  @Column({ default: false })
  bitgetPartner: boolean;

  @Column({ default: false })
  onTelegramGroup: boolean;

  @Column({ nullable: true, type: 'bigint' })
  telegramId: bigint;

  @Column({ nullable: true })
  avatar: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relate the trade operation to the user
  @ManyToMany(() => TradeOperation)
  @JoinTable()
  tradeOperations: TradeOperation[];
}

export default User;
