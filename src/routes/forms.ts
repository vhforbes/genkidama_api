import { Router } from 'express';
import CreateMentoriaFormService from '../services/Forms/CreateMentoriaFormService';
const formsRouter = Router();

formsRouter.post('/mentoria', async (req, res) => {
  const { name, email, phoneNumber, telegramUsername, tradingTime } = req.query;

  const response = CreateMentoriaFormService.execute({
    name: name as string,
    email: email as string,
    phone_number: phoneNumber as string,
    telegram_username: telegramUsername as string,
    trading_time: tradingTime as string,
  });

  return res.json(response);
});

export default formsRouter;
