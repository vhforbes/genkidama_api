import { Router } from 'express';
import paypalRouter from './paypal.router';
import postsRouter from './posts.router';
import sessionsRouter from './sessions.router';
import usersRouter from './users.router';

const routes = Router();

routes.use('/users', usersRouter);
routes.use('/posts', postsRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/paypal', paypalRouter);

export default routes;
