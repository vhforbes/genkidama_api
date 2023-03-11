/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

// Decorator => A classe é um parametro sendo passado para o decorator Entity
@Entity('mentoriaForm')
class MentoriaForm {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  phone_number: string;

  @Column({ nullable: true })
  telegram_username: string;

  @Column({ nullable: true })
  trading_time: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}

export default MentoriaForm;
