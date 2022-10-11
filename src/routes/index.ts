import { Router } from 'express';
import postsRouter from './posts.router';
import sessionsRouter from './sessions.router';
import usersRouter from './users.router';

const routes = Router();

routes.use('/users', usersRouter);
routes.use('/posts', postsRouter);
routes.use('/sessions', sessionsRouter);

export default routes;
