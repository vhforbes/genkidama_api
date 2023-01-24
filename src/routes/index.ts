import { Router } from 'express';
import formsRouter from './forms';
import paypalRouter from './paypal.router';
import postsRouter from './posts.router';
import sessionsRouter from './sessions.router';
import subscriptionsRouter from './subscriptions';
import tradeOperationsRouter from './tradeOperationsRouter';
import usersRouter from './users.router';

const routes = Router();

routes.use('/users', usersRouter);
routes.use('/posts', postsRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/paypal', paypalRouter);
routes.use('/subscriptions', subscriptionsRouter);
routes.use('/trade-operations', tradeOperationsRouter);
routes.use('/forms', formsRouter);

export default routes;
