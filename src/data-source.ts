import dotenv from 'dotenv';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

import { postsTableUsersTable1664455607246 } from './migrations/1664455607246-postsTableUsersTable';
import { verifiedUserAttribute1668256084805 } from './migrations/1668256084805-verifiedUserAttribute';

import Post from './models/Post';
import Token from './models/Token';
import User from './models/User';

dotenv.config();

const enviroment = process.env.ENVIROMENT;

export const AppDataSource = new DataSource({
  url: process.env.DATABASE_URL,
  type: 'postgres',
  synchronize: true,
  logging: false,
  entities: [Post, User, Token],
  migrations: [
    postsTableUsersTable1664455607246,
    verifiedUserAttribute1668256084805,
  ],
  subscribers: [],
  ssl:
    enviroment === 'local'
      ? false
      : {
          rejectUnauthorized: false,
        },
});
