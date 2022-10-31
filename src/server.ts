import 'reflect-metadata';
import 'express-async-errors';

import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import routes from './routes';
import { AppDataSource } from './data-source';
import uploadConfig from './config/upload';
import AppError from './errors/AppError';

AppDataSource.initialize()
  .then(async () => {
    console.log('Data Source has been initialized!');
  })
  .catch(err => {
    console.error('Error during Data Source initialization:', err);
  });

const app = express();

app.use(cors());
app.use(express.json());

app.use('/files', express.static(uploadConfig.tmpPath));
app.use(routes);
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
});

app.listen(3333, () => {
  console.log('Server started on port 3333');
});
