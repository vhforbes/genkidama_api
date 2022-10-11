import fs from "fs";
import path from "path";

import { AppDataSource } from "../data-source";

import uploadConfig from "../config/upload";
import User from "../models/User";
import AppError from "../errors/AppError";

/**
 * [x] Recebe as infos da chamada
 * [x] Tratativa de erros/excessoes, logicas de negcio, ifs
 * [x] Acesso ao repositorio
 */

interface Request {
  user_id: string;
  avatar: string;
}

class UpdateUserAvatarService {
  public async execute({ user_id, avatar }: Request): Promise<User> {
    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOne({
      where: { id: user_id },
    });

    if (!user) {
      throw new AppError("Invalid user to update avatar");
    }

    // Remove if existing avatar file.
    if (user.avatar) {
      const userAvatarFilePath = path.join(uploadConfig.tmpPath, user.avatar);

      const avatarExists = await fs.promises.stat(userAvatarFilePath);

      if (avatarExists) {
        await fs.promises.unlink(userAvatarFilePath);
      }
    }

    user.avatar = avatar;

    userRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
