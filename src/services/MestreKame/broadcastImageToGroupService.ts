import fs from 'fs';
import path from 'path';

import uploadConfig from '../../config/upload';
import AppError from '../../errors/AppError';
import { bot } from '../../bot/initializeBot';

interface Request {
  fileName: string;
}

const groupId = process.env.GROUP_ID as string;
// process.env.NTBA_FIX_350 = 1;

class BroadcastImageToGroupService {
  public static async execute({
    fileName,
  }: Request): Promise<{ status: string }> {
    // Remove if existing avatar file.

    const filePath = path.join(uploadConfig.tmpPath, fileName);

    try {
      await bot.sendPhoto(
        groupId,
        fs.createReadStream(filePath),
        {},
        { contentType: 'image/*' },
      );
      return { status: 'ok' };
    } catch (error) {
      throw new AppError('Cloud not send message');
    }
  }
}

export default BroadcastImageToGroupService;
