import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";
import { EmailAlreadyUsedError, EmailOrPasswordInvalidsError, NotFoundError, RequestDataMissingError } from "../../erros/errors";

import { User } from "../../domain/model/user.model";
import { userRepository } from "../../repository/user-repository";
import { UserDTO } from "../../domain/dto/user.model.DTO";

require("dotenv").config(); // Carrega as variáveis do .env

interface UserTokenPayload {
  userId: string;
  userEmail: string;
  userName: string;
}

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

export async function getAllUsersUseCase() {
  try {
    const usersList = userRepository.getAll();

    if (!usersList) throw new NotFoundError();

    return usersList;
  } catch (error) {
    throw error;
  }
}

export async function userLoginUseCase({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  try {
    const SECRET = process.env.SECRET || "DAKHFBAKFA4G51A8SDF14AS1F";

    const userFoundedByEmail = await userRepository.login({ email });

    if (!userFoundedByEmail) throw new EmailOrPasswordInvalidsError();

    const isPasswordValid = await bcrypt.compare(
      password,
      userFoundedByEmail.user.getPassword,
    );

    if (!isPasswordValid) throw new EmailOrPasswordInvalidsError();

    const token = Jwt.sign(
      {
        userId: userFoundedByEmail.user.getId,
        userEmail: userFoundedByEmail.user.getEmail,
        userName: userFoundedByEmail.user.getName,
      },
      SECRET,
      { expiresIn: 60 * 60 }, //1h
    );

    console.log("🚀 user-UseCase ~ token:", token);

    return { token: token };
  } catch (error) {
    throw error;
  }
}

//partial para tornar as propriedades como opcionais
export async function userUpdateUseCase({
  id,
  userData,
}: {
  id: string;
  userData: Partial<UserDTO>;
}) {
  try {
    const { name, email, password } = userData;

    if (!name && !email && !password) throw new RequestDataMissingError();

    const userUpdated = await userRepository.update({
      id: id,
      userData: { name, email, password },
    });

    if (!userUpdated) throw new NotFoundError();

    return userUpdated;
  } catch (error) {
    throw error;
  }
}