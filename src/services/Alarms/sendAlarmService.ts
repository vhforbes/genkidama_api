import AppError from '../../errors/AppError';
import sendAlarmToUsers from '../../bot/utils/sendAlarmToUsers';
import UsersRepository from '../../repositories/UsersRepository';

interface AlarmRequest {
  ticker: string;
  message: string;
}

class SendAlarmService {
  public static async execute({
    ticker,
    message,
  }: AlarmRequest): Promise<string> {
    const users = await UsersRepository.membersWithActiveAlarms();

    if (!ticker) {
      throw new AppError('No ticker provided.');
    }

    const sanitizedTicker = ticker.replace(/USD.*$/, '');

    const bitgetLink = `https://www.bitget.com/futures/usdt/${sanitizedTicker}USDT`;
    const bybitLink = `https://www.bybit.com/trade/usdt/${sanitizedTicker}USDT`;

    await sendAlarmToUsers({
      users,
      ticker: sanitizedTicker,
      message,
      bitgetLink,
      bybitLink,
    });

    return 'ok';
  }
}

export default SendAlarmService;
