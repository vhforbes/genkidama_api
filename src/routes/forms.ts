import { Router } from 'express';
import CreateMentoriaFormService from '../services/Forms/CreateMentoriaFormService';
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

export default formsRouter;
