import { NextFunction, Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import AppError from '../errors/AppError';
import User from '../models/User';

export const ensureAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const usersRepository = AppDataSource.getRepository(User);

  const user = await usersRepository.findOne({
    where: { id: req.user.id },
  });

  if (!user) {
    throw new AppError('User not found');
  }

  if (user.role !== 'ADMIN') {
    throw new AppError('You need to be a admin');
  }

  return next();
};
