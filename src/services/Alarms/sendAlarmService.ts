import sendMessageToGroup from '../../bot/utils/sendMessageToGroup';
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
    const users = await UsersRepository.memberList();

    const messageHtml = `Alarme disparado!
  ${ticker.toUpperCase()} 
  ${message}`;

    sendMessageToUsers({ users, messageHtml });
    sendMessageToGroup(messageHtml);

    return 'ok';
  }
}

export default SendAlarmService;
