import dotenv from 'dotenv';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

import Subscription from './models/Subscription';
import User from './models/User';
import ConfirmEmailToken from './models/ConfirmEmailToken';
import PaypalAccessToken from './models/PayPalAccessToken';
import TradeOperation from './models/TradeOperation';
import MentoriaForm from './models/MentoriaForm';
import ExclusiveVideo from './models/ExclusiveVideo';
import BitgetUID from './models/BitgetAssociatedUids';
import TradeOperationHistory from './models/TradeOperationHistory';

import { RenameIsBitgetPartnerToIsExchangePartner1693913129073 } from './migrations/1693913129073-RenameIsBitgetPartnerToIsExchangePartner';
import { AddExchangeColumn1630840800000 } from './migrations/1693920362640-AddExchangeColumn';
import BybitUID from './models/BybitAssociatedUids';
import LiveStatus from './models/LiveStatus';

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
    TradeOperationHistory,
    MentoriaForm,
    BitgetUID,
    BybitUID,
    LiveStatus,
  ],
  migrations: [
    RenameIsBitgetPartnerToIsExchangePartner1693913129073,
    AddExchangeColumn1630840800000,
  ],
  subscribers: [],
  ssl:
    enviroment === 'local'
      ? false
      : {
          rejectUnauthorized: false,
        },
});
