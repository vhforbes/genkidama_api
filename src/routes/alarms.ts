import { Router } from 'express';

const alarmsRouter = Router();

alarmsRouter.post('/', async (req, res) => {
  const requestBody = req.body;

  console.log(requestBody);

  return res.json({ ok: 'ok' });
});

export default alarmsRouter;
