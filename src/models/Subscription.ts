/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('subscriptions')
class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @Column()
  status: string;

  @Column()
  paypal_subscription_id: string;

  @Column()
  plan_id: string;

  @Column()
  current_period_start: string;

  @Column()
  current_period_end: string;

  @Column({ nullable: true })
  canceled_at: string;

  @Column({ nullable: true })
  cancelation_reason: string | null;
}

export default Subscription;
