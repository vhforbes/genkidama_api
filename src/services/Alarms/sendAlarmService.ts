import sendMessageToUsers from '../../bot/utils/sendMessageToUsers';
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

    const sanitizedTicker = ticker
      .replace(/usdt/i, '')
      .replace(/\s+/g, '')
      .toUpperCase();

    const linkToBitget = `https://www.bitget.com/futures/usdt/${sanitizedTicker}USDT`;

    const messageHtml = `Alarme disparado!
  ${sanitizedTicker}USDT
  ${message}
  <a href="${linkToBitget}">Acessar ${sanitizedTicker}USDT na Bitget</a>
  `;

    sendMessageToUsers({ users, messageHtml });

    return 'ok';
  }
}

export default SendAlarmService;
