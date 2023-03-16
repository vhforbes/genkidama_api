/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import User from './User';

@Entity('bitgetUID')
class BitgetUID {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  BitgetUID: string;
}

export default BitgetUID;
