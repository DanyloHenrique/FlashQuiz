import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../../middleware/authenticateToken";
import { NotFoundError, NotLoggedError } from "../../erros/errors";
import { studySessionUseCases } from "../../useCases/studySession/studySession-usecases";
import { z } from "zod";
import { Status } from "../../domain/model/studySession.model";

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
      console.error(
        "studySessionController - getById",
        " :: Error ❌ : ",
        error,
      );
      next(error);
    }
  },

  async updateStatus(
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const userId = request.userIdToken;
      const { studySessionId } = request.params;
      const { statusUpdate } = request.body;

      if (!userId) throw new NotLoggedError();

      const updateSchema = z.object({
        studySessionId: z.string(),
        statusUpdate: z.enum([
          Status.PROGRESS,
          Status.PAUSED,
          Status.COMPLETED,
        ]),
      });

      updateSchema.parse({ studySessionId, statusUpdate });

      const updatedStatus = await studySessionUseCases.updateStatus(
        studySessionId,
        statusUpdate,
      );

      if (!updatedStatus) throw new Error();

      return response.status(200).json({
        sucess: true,
        data: updatedStatus,
        message: "Status atualizado com sucesso",
      });
    } catch (error) {
      console.error("studySessionController - updateStatus: ", error);
      next(error);
    }
  },

  async addFlashcardToViewLater(
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const userId = request.userIdToken;
      const { studySessionId } = request.params;
      const { flashcardId } = request.body;
      if (!userId) throw new NotLoggedError();

      const addFLashcardSchema = z.object({
        studySessionId: z.string(),
        flashcardId: z.string(),
      });
      addFLashcardSchema.parse({ studySessionId, flashcardId });

      const updatedFlashcardToViewList =
        await studySessionUseCases.addFlashcardToViewLater(
          studySessionId,
          flashcardId,
        );

      if (!updatedFlashcardToViewList) throw new Error();

      return response.status(200).json({
        sucess: true,
        data: updatedFlashcardToViewList,
        message: "flashcard adicionado a lista de ver depois com sucesso",
      });
    } catch (error) {
      console.error("studySessionController - addFlashcardToViewList: ", error);
      next(error);
    }
  },

  async deleteFromFlashcardToViewLater(
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const userId = request.userIdToken;
      const { studySessionId } = request.params;
      const { flashcardId } = request.body;
      if (!userId) throw new NotLoggedError();

      const addFLashcardSchema = z.object({
        studySessionId: z.string(),
        flashcardId: z.string(),
      });
      addFLashcardSchema.parse({ studySessionId, flashcardId });

      const updatedFlashcardToViewList =
        await studySessionUseCases.deleteFromFlashcardToViewLater(
          studySessionId,
          flashcardId,
        );

      if (!updatedFlashcardToViewList) throw new Error();

      return response.status(200).json({
        sucess: true,
        data: updatedFlashcardToViewList,
        message: "flashcard removido da lista de ver depois com sucesso",
      });
    } catch (error) {
      console.error(
        "studySessionController - deleteFromFlashcardToViewLater: ",
        error,
      );
      next(error);
    }
  },

  async finishStudySession(
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const userId = request.userIdToken;
      const { studySessionId } = request.params;

      if (!userId) throw new NotLoggedError();

      const finishedStudySession = await studySessionUseCases.finishStudySession(
        studySessionId,
      );

      if (!finishedStudySession) throw new Error();

      return response.status(200).json({
        sucess: true,
        data: finishedStudySession,
        message: "sessão de estudo completa",
      });
    } catch (error) {
      console.error("studySessionController - finishStudySession: ", error);
      next(error);
    }
  },
};
