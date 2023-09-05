/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import User from './User';

@Entity('bybitUID')
class BybitUID {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  BybitUID: string;
}

export default BybitUID;
