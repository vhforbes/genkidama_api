/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, PrimaryGeneratedColumn, RelationId } from 'typeorm';

@Entity('subscriptions')
class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @Column()
  status: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  paypal_subscription_id?: string;

  @Column({ nullable: true })
  plan_id?: string;

  @Column({ nullable: true })
  type?: string;

  @Column()
  current_period_start: string;

  @Column({ nullable: true })
  current_period_end?: string;

  @Column({ nullable: true })
  canceled_at?: string;

  @Column({ nullable: true })
  cancelation_reason?: string;
}

export default Subscription;
