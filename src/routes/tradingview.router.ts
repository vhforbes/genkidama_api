import { Router } from 'express';
import SendAlarmService from '../services/Alarms/sendAlarmService';
import AppError from '../errors/AppError';
import { UpdateTradeOperationInterface } from '../interfaces/TradeOperationInterface';
import UpdateTradeOperationService from '../services/TradeOperations/updateTradeOperationService';

const tradingviewRouter = Router();

interface Alarm {
  ticker: string;
  message: string;
}

tradingviewRouter.post('/alarm', async (req, res) => {
  const requestBody = req.body as Alarm;

  console.log(requestBody);

  if (!requestBody) {
    throw new AppError('No body for alarm');
  }

  SendAlarmService.execute(requestBody);

  return res.json({ ok: 'ok' });
});

tradingviewRouter.post('/operation', async (req, res) => {
  const requestBody = req.body as UpdateTradeOperationInterface;

  const response = await UpdateTradeOperationService.execute(requestBody);

  return res.json({ response });
});

export default tradingviewRouter;
