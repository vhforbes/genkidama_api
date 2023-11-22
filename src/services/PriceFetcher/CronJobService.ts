import CronJobManager from 'cron-job-manager';
import CheckPriceService from './CheckPriceService';

export class CronJobManagerService {
  private manager: CronJobManager;

  constructor() {
    this.manager = new CronJobManager();
  }

  startJob(operationId: string, market: string, cronTime: string): void {
    if (!this.manager.exists(operationId)) {
      this.manager.add(operationId, cronTime, async () => {
        try {
          await CheckPriceService.execute(market);
        } catch (error) {
          console.error(
            `Error in cron job for operation ${operationId}:`,
            error,
          );
        }
      });
      this.manager.start(operationId);
      console.log(`Cron job for operation ${operationId} started`);
    }
  }

  stopJob(operationId: string): void {
    if (this.manager.exists(operationId)) {
      this.manager.stop(operationId);
      this.manager.deleteJob(operationId);
      console.log(`Cron job for operation ${operationId} stopped`);
    }
  }
}
