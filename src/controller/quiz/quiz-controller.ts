import { Request, Response, NextFunction } from "express";

import { z } from "zod";

import { AuthenticatedRequest } from "../../middleware/authenticateToken";
import { quizUseCase } from "../../useCases/quiz/quiz-useCases";
import { Visibility } from "../../domain/model/quiz.model";
import { Flashcard } from "../../domain/model/flashcard.model";
import { NotFoundError, NotLoggedError } from "../../erros/errors";

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
};
