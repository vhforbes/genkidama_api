import UsersRepository from '../../repositories/UsersRepository';
import SubscriptionStatusService from './SubscriptionStatusService';

class CheckAllSubs {
  public static async execute(): Promise<{ status: string | null }> {
    const members = await UsersRepository.memberList();

    members.forEach(async member => {
      await SubscriptionStatusService.execute({ userId: member.id });
    });

    return { status: 'all checked' };
  }
}

export default CheckAllSubs;
