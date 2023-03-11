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

@Entity('paypalAccessToken')
class PaypalAccessToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  paypal_access_token: string;
}

export default PaypalAccessToken;
