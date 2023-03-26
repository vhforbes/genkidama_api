/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import Subscription from './Subscription';
import User from './User';

// Decorator => A classe é um parametro sendo passado para o decorator Entity
@Entity('telegramMember')
class TelegramMember {
  @PrimaryColumn()
  user_id: string;

  @OneToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  telegram_id: number;

  @OneToOne(() => Subscription, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'subscription_id' })
  subscription: Subscription;

  @Column({ nullable: true })
  subscription_id: string;

  @Column({ nullable: true })
  role: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default TelegramMember;
