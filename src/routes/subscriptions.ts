import { Router } from 'express';
import { ensureAutenticated } from '../middlewares/ensureAuthenticated';
import CreateSubscriptionService from '../services/Subscriptions/CreateSubscription';

const subscriptionsRouter = Router();

subscriptionsRouter.post('/create', ensureAutenticated, async (req, res) => {
  /* 
        Paypal Token Middleware
        - Validar se o token atual é valido ou pegar novo token
        
        Create Subscription Service
        - Fazer chamada para pegar detalhes da order
        - Passar esses detalhes para nossa DB
        - Ativar a subscription
        
        */
  const { email, subscriptionID } = req.body;

  // const subscriptionId = req.params.subscription_id; // will come from the front end

  const createdSubscription = await CreateSubscriptionService.execute({
    email,
    subscriptionID,
  });

  return res.json(createdSubscription);
});

export default subscriptionsRouter;
