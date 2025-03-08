import { Request, Response, NextFunction } from "express";

import {
  userCreateUseCase} from "../../useCases/user/user-useCases";
import { z } from "zod";


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

};
