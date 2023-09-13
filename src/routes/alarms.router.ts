import { Router } from 'express';
import SendAlarmService from '../services/Alarms/sendAlarmService';
import AppError from '../errors/AppError';

const alarmsRouter = Router();

interface Alarm {
  ticker: string;
  message: string;
}

alarmsRouter.post('/', async (req, res) => {
  const requestBody = req.body as Alarm;

  if (!requestBody) {
    throw new AppError('No body for alarm');
  }

  SendAlarmService.execute(requestBody);

  return res.json({ ok: 'ok' });
});

export default alarmsRouter;
