import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

import { AppDataSource } from "../data-source";

import AuthConfig from "../config/auth";
import User from "../models/User";
import AppError from "../errors/AppError";
/**
 * [x] Recebe as infos da chamada
 * [x] Tratativa de erros/excessoes, logicas de negcio, ifs
 * [x] Acesso ao repositorio
 */

interface Request {
  email: string;
  password: string;
}

interface Return {
  user: User;
  token: string;
}

class CreateSessionService {
  public async execute({ email, password }: Request): Promise<Return> {
    // Transforma a data em um horario inicial, 9:15 => 9:00
    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOne({
      where: { email },
    });

    if (!user) {
      console.log("fuck1");
      throw new AppError("Invalid user or password", 401);
    }

    const validPassword = await compare(password, user.password);

    if (!validPassword) {
      console.log("fuck2");
      throw new AppError("Invalid user or password", 401);
    }

    const { secret, expiresIn } = AuthConfig.jwt;

    var token = sign({ id: user.id, name: user.name }, secret, { expiresIn });

    return { user, token };
  }
}

export default CreateSessionService;
