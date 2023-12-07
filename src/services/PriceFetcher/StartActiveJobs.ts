import GetFilteredTradeOperationsService from '../../services/TradeOperations/getFilteredOperationsService';
import { CronJobManagerService } from './CronJobService';

class StartActiveJobs {
  public static async execute(): Promise<any> {
    const cronJobManagerService = new CronJobManagerService();

    try {
      const activeParams = { status: ['ativa', 'aguardando'] };
      const tradeOperationsResult =
        await GetFilteredTradeOperationsService.execute(activeParams);

      let delay = 0;
      const delayIncrement = 20000; // 20 seconds delay increment

      tradeOperationsResult?.tradeOperations.forEach(tradeOperation => {
        setTimeout(() => {
          cronJobManagerService.startJob(tradeOperation);
        }, delay);

        delay += delayIncrement; // Increase delay for the next iteration
      });
    } catch (error) {
      console.error('Error fetching trade operations:', error);
      // ... error handling
    }
  }
}

export default StartActiveJobs;
