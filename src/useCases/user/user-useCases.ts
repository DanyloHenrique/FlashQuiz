import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";
import {
  EmailAlreadyUsedError,
  EmailOrPasswordInvalidsError,
  NotFoundError,
  RequestDataMissingError,
} from "../../erros/errors";

import { User } from "../../domain/model/user.model";
import { userRepository } from "../../repository/user-repository";
import { UserDTO } from "../../domain/dto/user.model.DTO";
import { generateToken } from "../../utils/authUtils";

require("dotenv").config(); // Carrega as variáveis do .env
const SECRET = process.env.SECRET;

interface UserTokenPayload {
  userId: string;
  userEmail: string;
  userName: string;
}

export const userUseCase = {
  async create(userData: UserDTO) {
    try {
      const { name, email, password } = userData;

      const userFoundByEmail = await userRepository.getByEmail(email);
      if (userFoundByEmail) throw new EmailAlreadyUsedError();

      const userObj = new User({ name, email, password });

      //criptografando a senha
      const hashPassword = await bcrypt.hash(password, 10);
      userObj.setPassword(hashPassword);

      const userCreated = userRepository.create(userObj);

      return userCreated;
    } catch (error) {
      console.log("🚀 useCase ~ create ~ error:", error);
      throw error;
    }
  },

  async getByEmail(email: string) {
    try {
      if (!email) throw new RequestDataMissingError();

      const userFounded = await userRepository.getByEmail(email);
      if (!userFounded) throw new NotFoundError();

      return userFounded;
    } catch (error) {
      throw error;
    }
  },

  async getAll() {
    try {
      const usersList = await userRepository.getAll();

      if (!usersList) throw new NotFoundError();

      return usersList;
    } catch (error) {
      throw error;
    }
  },

  async Login({ email, password }: { email: string; password: string }) {
    try {
      if (!email || !password) throw new RequestDataMissingError();
      if (!SECRET) throw new Error();

      const userFoundedByEmail = await userRepository.getByEmail(email);
      if (!userFoundedByEmail) throw new EmailOrPasswordInvalidsError();

      const isPasswordValid = await bcrypt.compare(
        password,
        userFoundedByEmail.user.getPassword(),
      );

      if (!isPasswordValid) throw new EmailOrPasswordInvalidsError();

      const token = generateToken(
        userFoundedByEmail.user.getId(),
        userFoundedByEmail.user.getEmail(),
        userFoundedByEmail.user.getName(),
      );

      console.log("🚀 user-UseCase ~ token:", token);

      return { token: token };
    } catch (error) {
      throw error;
    }
  },

  async update({
    id,
    dataToUpdateUser,
  }: {
    id: string;
    dataToUpdateUser: Partial<UserDTO>;
  }) {
    try {
      const { name, email } = dataToUpdateUser;
      let { password } = dataToUpdateUser;

      if (!name && !email && !password) throw new RequestDataMissingError();

      const foundUserById = await userRepository.getById(id);
      if (!foundUserById) throw new NotFoundError("user");

      //criptografa a senha se ela existir
      if (password) {
        password = await bcrypt.hash(password, 10);
      }

      const userUpdated = await userRepository.update({
        userCurrentData: foundUserById.user,
        userUpdateData: { name, email, password },
      });

      if (!userUpdated) throw new NotFoundError();

      return userUpdated;
    } catch (error) {
      throw error;
    }
  },

  async delete(id: string) {
    try {
      if (!id) throw new RequestDataMissingError();

      const userDelete = await userRepository.delete({ id });
      if (!userDelete) throw new NotFoundError();

      return { user: userDelete };
    } catch (error) {
      throw error;
    }
  },
};
