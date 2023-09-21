import { Router } from 'express';
import CreateMentoriaFormService from '../services/Forms/CreateMentoriaFormService';
import {
  alertLiveClose,
  alertLiveStart,
} from '../bot/livesBot/alertLiveStatus';
import StartLiveService from '../services/Forms/StartLiveService';
const formsRouter = Router();

formsRouter.post('/mentoria', async (req, res) => {
  const { name, email, phoneNumber, telegramName, tradingTime } = req.body;

  const response = await CreateMentoriaFormService.execute({
    name: name as string,
    email: email as string,
    phone_number: phoneNumber as string,
    telegram_username: telegramName as string,
    trading_time: tradingTime as string,
  });

  return res.json(response);
});

formsRouter.post('/startLive', async (req, res) => {
  await alertLiveStart();
  await StartLiveService.execute({ live: true });

  return res.json({ status: 'live started' });
});

formsRouter.post('/closeLive', async (req, res) => {
  await alertLiveClose();
  await StartLiveService.execute({ live: false });

  return res.json({ status: 'live ended' });
});

export default formsRouter;
