/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import Subscription from './Subscription';

// Decorator => A classe é um parametro sendo passado para o decorator Entity
@Entity('users')
class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  role: string;

  @Column({ nullable: true })
  subscription_id: string;

  @OneToOne(() => Subscription, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'subscription_id' })
  subscription: Subscription;

  @Column({ default: false })
  verified: boolean;

  @Column({ nullable: true })
  avatar: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default User;
