import { Router } from 'express';
import formsRouter from './forms.router';
import paypalRouter from './paypal.router';
import sessionsRouter from './sessions.router';
import subscriptionsRouter from './subscriptions';
import tradeOperationsRouter from './tradeOperations.router';
import usersRouter from './users.router';
import exclusiveVideoRouter from './exclusiveVideos.router';
import bitgetRouter from './bitget.router';
import mestreKameRouter from './mestreKame.router';
import alarmsRouter from './alarms.router';
import xdecowRouter from './xdecow.router';
import tradingviewRouter from './tradingview.router';
import fetchPriceRouter from './fetchPrice.router';

const routes = Router();

routes.use('/users', usersRouter);
routes.use('/exclusive-videos', exclusiveVideoRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/paypal', paypalRouter);
routes.use('/subscriptions', subscriptionsRouter);
routes.use('/trade-operations', tradeOperationsRouter);
routes.use('/forms', formsRouter);
routes.use('/bitget', bitgetRouter);
routes.use('/mestrekame', mestreKameRouter);
routes.use('/alarms', alarmsRouter); // TO BE DELETED IN FUTURE
routes.use('/tradingview', tradingviewRouter);
routes.use('/xdecow', xdecowRouter);
routes.use('/fetch-price', fetchPriceRouter);

export default routes;
