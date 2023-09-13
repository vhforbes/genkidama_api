import fs from 'fs';
import path from 'path';

import uploadConfig from '../../config/upload';
import { bot } from '../../bot/initializeBot';
import UsersRepository from '../../repositories/UsersRepository';

interface Request {
  fileName: string;
}

class BroadcastImageToMembersService {
  public static async execute({
    fileName,
  }: Request): Promise<{ status: string }> {
    // Remove if existing avatar file.

    const filePath = path.join(uploadConfig.tmpPath, fileName);

    const members = await UsersRepository.memberList();

    members.forEach(async member => {
      try {
        await bot.sendPhoto(
          member.telegramId,
          fs.createReadStream(filePath),
          {},
          { contentType: 'image/*' },
        );
      } catch (error) {
        console.error(error);
        console.error(`Cloud not send image to ${member.email}`);
      }
    });

    return { status: 'ok' };
  }
}

export default BroadcastImageToMembersService;
