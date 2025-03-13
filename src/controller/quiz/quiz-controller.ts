import { Request, Response, NextFunction } from "express";

import { z } from "zod";

import { AuthenticatedRequest } from "../../middleware/authenticateToken";
import { quizUseCase } from "../../useCases/quiz/quiz-useCases";
import { Visibility } from "../../domain/model/quiz.model";
import { Flashcard } from "../../domain/model/flashcard.model";
import { NotFoundError, NotLoggedError } from "../../erros/errors";
import { QuizDTO } from "../../domain/dto/quiz.model.DTO";

const flashCardSchema = z.object({
  term: z.string(),
  description: z.string(),
});

const quizSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  visibility: z.enum([Visibility.PUBLIC, Visibility.PRIVATE]),
  flashcardList: z.array(flashCardSchema).optional(),
});

const quizUpdateSchame = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  visibility: z.enum([Visibility.PUBLIC, Visibility.PRIVATE]).optional(),
});

export const quizController = {
  async create(
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const userId = request.userIdToken;
      const { title, description, visibility, flashcardList } = request.body;

      if (!userId) throw new Error();

      quizSchema.parse({ title, description, visibility, flashcardList });

      const createdQuiz = await quizUseCase.create({
        userId,
        title,
        description,
        visibility,
        flashcardList: flashcardList ?? [],
      });

      if (!createdQuiz) throw new NotFoundError();
      console.log("🚀 ~ createdQuiz:", createdQuiz);

      return response.status(201).json({
        sucess: true,
        data: createdQuiz,
        message: "Quiz criado com sucesso!",
      });
    } catch (error) {
      console.error("quiz-controller.ts", " :: Error ❌ : ", error);
      next(error);
    }
  },

  async getAllFromUser(
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const userIdToken = request.userIdToken;
      if (!userIdToken) throw new NotLoggedError();

      const findedAllQuizFromUser = await quizUseCase.findAllFromUser(
        userIdToken,
      );

      if (!findedAllQuizFromUser) throw new NotFoundError();

      return response.status(200).json({
        sucess: true,
        data: findedAllQuizFromUser,
        message: "lista de Quiz do usuário",
      });
    } catch (error) {
      console.error("quiz-controller.ts", " :: Error ❌ : ", error);
      next(error);
    }
  },

  async getAllPublic(
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const userIdToken = request.userIdToken;
      if (!userIdToken) throw new NotLoggedError();

      const findedAllQuizPublic = await quizUseCase.findAllPublic();

      if (!findedAllQuizPublic) throw new NotFoundError();

      return response.status(200).json({
        sucess: true,
        data: findedAllQuizPublic,
        message: "lista de Quiz públicos",
      });
    } catch (error) {
      console.error("quiz-controller.ts", " :: Error ❌ : ", error);
      next(error);
    }
  },

  async getById(
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const userIdToken = request.userIdToken;
      if (!userIdToken) throw new NotLoggedError();

      const { id } = request.params;
      const idSchema = z.string();

      idSchema.parse(id);

      const foundQuizById = await quizUseCase.findById(id);

      if (!foundQuizById) throw new NotFoundError("quiz");

      return response.status(200).json({
        sucess: true,
        data: foundQuizById,
        message: "Quiz buscado com sucesso",
      });
    } catch (error) {
      console.error("quiz-controller.ts - findById", " :: Error ❌ : ", error);
      next(error);
    }
  },

  async update(
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const userIdToken = request.userIdToken;
      const userQuizRequest = request.body;
      const { id } = request.params;

      if (!userIdToken) throw new NotLoggedError();
      const idSchema = z.string();
      idSchema.parse(id);

      const validatedQuizDate = quizUpdateSchame.parse(userQuizRequest);

      const quizPartial: Partial<QuizDTO> = validatedQuizDate;

      const userUpdated = await quizUseCase.update({
        id: id,
        quizData: quizPartial,
      });

      if (!userUpdated) throw new Error();

      return response.status(200).json({
        sucess: true,
        data: userUpdated,
        message: "Quiz atualizado com sucesso",
      });
    } catch (error) {
      console.error("quiz-controller.ts - delete", " :: Error ❌ : ", error);
      next(error);
    }
  },

  async delete(
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const userIdToken = request.userIdToken;
      if (!userIdToken) throw new NotLoggedError();

      const { id } = request.params;
      const idSchema = z.string();
      idSchema.parse(id);

      const deletedQuiz = await quizUseCase.delete(id);

      if (!deletedQuiz) throw new Error();

      return response.status(200).json({
        sucess: true,
        data: deletedQuiz,
        message: "Quiz deletado com sucesso",
      });
    } catch (error) {
      console.error("quiz-controller.ts - delete", " :: Error ❌ : ", error);
      next(error);
    }
  },
};
