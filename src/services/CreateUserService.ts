import { hash } from "bcryptjs";
import { AppDataSource } from "../data-source";
import AppError from "../errors/AppError";
import User from "../models/User";

/**
 * [x] Recebe as infos da chamada
 * [x] Tratativa de erros/excessoes, logicas de negcio, ifs
 * [x] Acesso ao repositorio
 */

interface Request {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  public async execute({ name, email, password }: Request): Promise<User> {
    // Transforma a data em um horario inicial, 9:15 => 9:00
    const userRepository = AppDataSource.getRepository(User);

    const userExists = await userRepository.findOne({
      where: { email },
    });

    if (userExists) {
      throw new AppError("Email already in use");
    }

    const hashedPassword = await hash(password, 8);

    const user = userRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    const results = await userRepository.save(user);

    return results;
  }
}

export default CreateUserService;
