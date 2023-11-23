import GetFilteredTradeOperationsService from '../../services/TradeOperations/getFilteredOperationsService';
import { CronJobManagerService } from './CronJobService';

class StartActiveJobs {
  public static async execute(): Promise<any> {
    const cronJobManagerService = new CronJobManagerService();

    try {
      // Call the service for 'active' status
      const activeParams = { status: ['ativa', 'aguardando'] };
      const tradeOperationsResult =
        await GetFilteredTradeOperationsService.execute(activeParams);

      tradeOperationsResult?.tradeOperations.forEach(tradeOperation => {
        cronJobManagerService.startJob(tradeOperation);
      });
    } catch (error) {
      console.error('Error fetching trade operations:', error);
      // ... error handling
    }
  }
}

export default StartActiveJobs;
