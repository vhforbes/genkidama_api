import 'reflect-metadata';
import dotenv from 'dotenv';
import { DataSource } from 'typeorm';

import { emptyMigration1669742463695 } from './migrations/1669742463695-emptyMigration';

import Subscription from './models/Subscription';
import User from './models/User';
import ConfirmEmailToken from './models/ConfirmEmailToken';
import PaypalAccessToken from './models/PayPalAccessToken';
import TradeOperation from './models/TradeOperation';
import MentoriaForm from './models/MentoriaForm';
import TelegramMember from './models/TelegramMember';
import ExclusiveVideo from './models/ExclusiveVideo';
import BitgetUID from './models/BitgetAssociatedUids';

dotenv.config();

const enviroment = process.env.ENVIROMENT;

export const AppDataSource = new DataSource({
  url: process.env.DATABASE_URL,
  type: 'postgres',
  synchronize: true,
  logging: false,
  entities: [
    ExclusiveVideo,
    User,
    ConfirmEmailToken,
    Subscription,
    PaypalAccessToken,
    TradeOperation,
    MentoriaForm,
    TelegramMember,
    BitgetUID,
  ],
  migrations: [
    emptyMigration1669742463695,
    // postsTableUsersTable1664455607246,
    // verifiedUserAttribute1668256084805,
    // createSubscription1669738765564,
  ],
  subscribers: [],
  ssl:
    enviroment === 'local'
      ? false
      : {
          rejectUnauthorized: false,
        },
});
