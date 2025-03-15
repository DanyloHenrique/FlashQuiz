import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../erros/errors";

//------------------CLASSE PRINCIPAL------------------------
// Middleware de tratamento de erros
export const errorHandler = async (
  error: unknown,
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  if (error instanceof ZodError) {
    return response.status(400).json({
      message: "Dados inválidos",
      errors: error.errors,
    });
  }

  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      sucess: false,
      message: error.message,
      errors: error,
    });
  }

  return response.status(500).json({
    message: "Erro interno no servidor",
    error,
  });
};
