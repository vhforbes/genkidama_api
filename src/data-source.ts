import 'reflect-metadata';

import { DataSource } from 'typeorm';
import { postsTableUsersTable1664455607246 } from './migrations/1664455607246-postsTableUsersTable';
import Post from './models/Post';
import User from './models/User';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'docker',
  database: 'genkidama',
  synchronize: true,
  logging: false,
  entities: [Post, User],
  migrations: [postsTableUsersTable1664455607246],
  subscribers: [],
});
