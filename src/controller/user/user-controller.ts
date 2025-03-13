import { Request, Response, NextFunction } from "express";

import { userUseCase } from "../../useCases/user/user-useCases";
import { z } from "zod";
import {
  NotFoundError,
  NotLoggedError,
  NotPermissionError,
} from "../../erros/errors";
import { UserDTO } from "../../domain/dto/user.model.DTO";
import { AuthenticatedRequest } from "../../middleware/authenticateToken";
import { error } from "console";

const UserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
});

// Criação de um schema para update baseado no schema de criação, mas com campos opcionais
const userLoginSchema = UserSchema.partial({ name: true });

const UserUpdateSchema = UserSchema.partial();

export const userController = {
  async create(request: Request, response: Response, next: NextFunction) {
    try {
      const { name, email, password } = request.body;

      //validação com zod
      UserSchema.parse({ name, email, password });

      const userCreated = await userUseCase.create({ name, email, password });
      if (!userCreated) throw new Error();

      return response.status(201).json({
        succes: true,
        data: userCreated,
        message: "Usuário criado com sucesso!",
      });
    } catch (error) {
      next(error);
    }
  },

  async getByEmail(request: Request, response: Response, next: NextFunction) {
    try {
      const { email } = request.body;
      const emailSchema = z.string().email();
      emailSchema.parse(email);

      const foundUserByEmail = await userUseCase.getByEmail(email);
      if (!foundUserByEmail) throw new NotFoundError();

      return response.status(200).json({
        succes: true,
        data: foundUserByEmail,
        message: "Usuário encontrado",
      });
    } catch (error) {
      next(error);
    }
  },

  async getAll(request: Request, response: Response, next: NextFunction) {
    try {
      const usersList = await userUseCase.getAll();
      if (!usersList) throw new NotFoundError();

      return response.status(200).json({
        message: "Todos os usuários encontrados!",
        data: usersList,
      });
    } catch (error) {
      next(error);
    }
  },

  async login(request: Request, response: Response, next: NextFunction) {
    try {
      const { email, password } = request.body;
      userLoginSchema.parse({ email, password });

      const userLoggedToken = await userUseCase.Login({ email, password });
      if (!userLoggedToken) throw new Error("Credenciais inválidas");

      return response.status(200).json({
        succes: true,
        data: { userLoggedToken },
        message: "Login realizado com sucesso",
      });
    } catch (error) {
      next(error);
    }
  },

  async update(
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const { userIdToken } = request;
      const { id } = request.params;
      const userDataRequest = request.body;

      if (!request.userIdToken) throw new NotLoggedError();

      //Verifica se id fornecido é o mesmo do usuário autenticado
      if (id !== userIdToken) throw new NotPermissionError();
      z.string().parse(id); //validações do id

      const validatedUserData = UserUpdateSchema.parse(userDataRequest); //pega os dados recebidos
      const user: Partial<UserDTO> = validatedUserData; //cria um user do tipo userDTO com atributos opcionais com os dados recebidos de validatedUserData
      console.log("🚀 ~ validatedUserData:", validatedUserData);
      console.log("🚀 ~ user:", user);

      const userUpdated = await userUseCase.update({
        id: id,
        dataToUpdateUser: user,
      });
      if (!userUpdated) throw new Error();

      return response.status(200).json({
        succes: true,
        message: "Usuário atualizado com sucesso!",
        data: userUpdated,
      });
    } catch (error) {
      next(error);
    }
  },

  async delete(
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const { userIdToken } = request;
      const { id } = request.params;

      if (!request.userIdToken) throw new NotLoggedError();

      //Verifica se id fornecido é o mesmo do usuário autenticado
      if (id !== userIdToken) throw new NotPermissionError();
      z.string().parse(id);

      const userDeleted = await userUseCase.delete(id);
      if (!userDeleted) throw new Error();

      return response.status(200).json({
        succes: true,
        data: userDeleted,
        message: "Usuário deletado com sucesso!",
      });
    } catch (error) {
      next(error);
    }
  },
};
