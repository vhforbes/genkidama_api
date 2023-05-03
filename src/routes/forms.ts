import { Router } from 'express';
import CreateMentoriaFormService from '../services/Forms/CreateMentoriaFormService';
import { alertLiveStart } from '../bot/livesBot/alertLiveStatus';
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

formsRouter.post('/startlive', async (req, res) => {
  await alertLiveStart();

  return res.json({ status: 'live started' });
});

export default formsRouter;
