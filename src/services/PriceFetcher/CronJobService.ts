import CronJobManager from 'cron-job-manager';
import CheckPriceService from './CheckPriceService';
import CheckTradeTriggersService from './CheckTradeTriggersService';
import { PayloadTradeOperationInterface } from '../../interfaces/TradeOperationInterface';
import sendMessageToAdmins from '../../bot/utils/sendMessageToAdmins';

export class CronJobManagerService {
  private manager: CronJobManager;

  constructor() {
    this.manager = new CronJobManager();
  }

  startJob(tradeOperation: PayloadTradeOperationInterface): void {
    if (!this.manager.exists(tradeOperation.id)) {
      this.manager.add(tradeOperation.id, '* * * * *', async () => {
        try {
          const priceData = await CheckPriceService.execute(
            tradeOperation.market,
          );

          CheckTradeTriggersService.execute(tradeOperation, priceData);
        } catch (error) {
          console.error(
            `Error in cron job for operation ${tradeOperation.id}:`,
            error,
          );
        }
      });
      this.manager.start(tradeOperation.id);
      console.log(`Cron job for operation ${tradeOperation.id} started`);
    }
  }

  stopJob(tradeOperation: PayloadTradeOperationInterface): void {
    if (this.manager.exists(tradeOperation.id)) {
      this.manager.stop(tradeOperation.id);
      this.manager.deleteJob(tradeOperation.id);

      console.log(`Cron job for operation ${tradeOperation.id} stopped`);

      sendMessageToAdmins({
        messageHtml: `Price checker job for ${tradeOperation.market} STOPPED`,
      });
    }
  }
}
