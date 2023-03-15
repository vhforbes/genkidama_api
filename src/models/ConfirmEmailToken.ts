/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import User from './User';

@Entity('confirmEmailTokens')
class ConfirmEmailToken {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  token: string;

  // @ManyToOne(() => User, { onDelete: 'CASCADE' })
  // @JoinColumn({ name: 'user_id' })
  // user: User;

  @Column()
  user_id: string;
}

export default ConfirmEmailToken;
