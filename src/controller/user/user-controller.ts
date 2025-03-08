import { Request, Response, NextFunction } from "express";

import {
  getAllUsersUseCase,
  getUserByEmailUseCase,
  userCreateUseCase,
  userLoginUseCase,
  userUpdateUseCase,
} from "../../useCases/user/user-useCases";
import { z } from "zod";
import { NotLoggedError, NotPermissionError } from "../../erros/errors";
import { UserDTO } from "../../domain/dto/user.model.DTO";
import { AuthenticatedRequest } from "../../middleware/authenticateToken";

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

      const userCreated = await userCreateUseCase({ name, email, password });

      return response.status(201).json({
        message: "Usuário criado com sucesso!",
        data: userCreated,
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

      const userFounded = await getUserByEmailUseCase(email);

      return response.status(200).json({
        message: "Usuário encontrado",
        data: userFounded,
      });
    } catch (error) {
      next(error);
    }
  },

  async getAll(request: Request, response: Response, next: NextFunction) {
    try {
      const usersList = await getAllUsersUseCase();

      if (!usersList) {
        return response.status(204).json({
          message: "Nenhum usuário encontrado",
        });
      }

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

      const userLoggedToken = await userLoginUseCase({ email, password });

      if (!userLoggedToken) {
        return response.status(401).json({ message: "Credenciais inválidas" });
      }

      return response.json({
        message: "Login realizado com sucesso",
        data: { userLoggedToken },
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

      //validações do id e dos dados do body
      z.string().parse(id);

      const validatedUserData = UserUpdateSchema.parse(userDataRequest); //pega os dados recebidos

      const user: Partial<UserDTO> = validatedUserData; //cria um user do tipo userDTO com atributos opcionais com os dados recebidos de validatedUserData

      const userUpdated = await userUpdateUseCase({
        id: id,
        userData: user,
      });

      return response.status(200).json({
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

      //validações do id
      z.string().parse(id);

      const userDeleted = await userDeleteUseCase(id);

      return response.status(200).json({
        message: "Usuário deletado com sucesso!",
        data: userDeleted,
      });
    } catch (error) {
      next(error);
    }
  },
};
