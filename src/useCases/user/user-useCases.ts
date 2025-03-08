import bcrypt from "bcrypt";
import { EmailAlreadyUsedError, NotFoundError } from "../../erros/errors";

require("dotenv").config(); // Carrega as variáveis do .env

import { User } from "../../domain/model/user.model";
import { userRepository } from "../../repository/user-repository";
import { UserDTO } from "../../domain/dto/user.model.DTO";

export async function userCreateUseCase(userData: UserDTO) {
  try {
    const { name, email, password } = userData;

    const userFoundedByEmail = userRepository.getByEmail(email);

    if (userFoundedByEmail) throw new EmailAlreadyUsedError();

    const userObj = new User({ name, email, password });

    //criptografando a senha
    const hashPassword = await bcrypt.hash(password, 10);
    userObj.setPassword(hashPassword);

    const userCreated = userRepository.create(userObj);

    return userCreated;
  } catch (error) {
    throw error;
  }
}

export async function getUserByEmailUseCase(email: string) {
  try {
    const userFounded = userRepository.getByEmail(email);
    if (!userFounded) throw new NotFoundError();
    return userFounded;
  } catch (error) {
    throw error;
  }
}
