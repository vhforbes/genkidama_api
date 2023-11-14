import { Router } from 'express';
import SendAlarmService from '../services/Alarms/sendAlarmService';

const alarmsRouter = Router();

interface Alarm {
  ticker: string;
  message: string;
  price: string;
}

alarmsRouter.post('/', async (req, res) => {
  const requestBody = req.body as Alarm;

  SendAlarmService.execute(requestBody);

  return res.json({ ok: 'ok' });
});

export default alarmsRouter;
