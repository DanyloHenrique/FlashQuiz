import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../../middleware/authenticateToken";
import { NotFoundError, NotLoggedError } from "../../erros/errors";
import { studySessionUseCases } from "../../useCases/studySession/studySession-usecases";
import { z } from "zod";

export const studySessionController = {
  async create(
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const userId = request.userIdToken;
      const { quizId } = request.params;

      if (!userId) throw new NotLoggedError();

      const idSchema = z.string();
      idSchema.parse(quizId);

      const CreatedStudySession = await studySessionUseCases.create({
        userId,
        quizId,
      });

      if (!CreatedStudySession) throw new Error();

      return response.status(201).json({
        sucess: true,
        data: CreatedStudySession,
        message: "Sessão de estudo iniciada com sucesso!",
      });
    } catch (error) {
      console.error("studySessionController", " :: Error ❌ : ", error);
      next(error);
    }
  },
  async getById(
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const userId = request.userIdToken;
      const { studySessionId } = request.params;

      if (!userId) throw new NotLoggedError();

      const idSchema = z.string();
      idSchema.parse(studySessionId);

      const foundStudySessionById = await studySessionUseCases.getById(
        studySessionId,
      );

      if (!foundStudySessionById) throw new Error();

      return response.status(200).json({
        sucess: true,
        data: foundStudySessionById,
        message: "Sessão de estudo encontrada com sucesso!",
      });
    } catch (error) {
      console.error("studySessionController - getById", " :: Error ❌ : ", error);
      next(error);
    }
  },
};
