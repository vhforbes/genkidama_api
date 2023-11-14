import sendAlarmToUsers from '../../bot/utils/sendAlarmToUsers';
import UsersRepository from '../../repositories/UsersRepository';
import SendAlarmService from './sendAlarmService';

jest.mock('../../bot/utils/sendAlarmToUsers');
jest.mock('../../repositories/UsersRepository');

describe('SendAlarmService', () => {
  it('should send alarm to users with active alarms and return "ok"', async () => {
    // Arrange
    const alarmRequest = {
      ticker: 'BTCUSD',
      message: 'Alarm message',
      price: '22',
    };
    const users = [
      { id: '1', name: 'John' },
      { id: '2', name: 'Jane' },
    ];
    (UsersRepository.membersWithActiveAlarms as jest.Mock).mockResolvedValue(
      users,
    );

    (sendAlarmToUsers as jest.Mock).mockResolvedValue(undefined);

    // Act
    const result = await SendAlarmService.execute(alarmRequest);

    // Assert
    expect(result).toEqual('ok');
    expect(UsersRepository.membersWithActiveAlarms).toHaveBeenCalled();
    expect(sendAlarmToUsers).toHaveBeenCalledWith({
      users,
      ticker: 'BTC',
      message: 'Alarm message',
      bitgetLink: 'https://www.bitget.com/futures/usdt/BTCUSDT',
      bybitLink: 'https://www.bybit.com/trade/usdt/BTCUSDT',
    });

    // await stopBot(); // stop the bot after all tests are done
  });
});
