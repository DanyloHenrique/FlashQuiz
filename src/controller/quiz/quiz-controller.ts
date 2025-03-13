import { Response, NextFunction } from "express";
import { z } from "zod";

import { AuthenticatedRequest } from "../../middleware/authenticateToken";
import { NotFoundError, NotLoggedError } from "../../erros/errors";
import { quizUseCase } from "../../useCases/quiz/quiz-useCases";
import { QuizDTO } from "../../domain/dto/quiz.model.DTO";
import {
  flashcardSchema,
  quizSchema,
  quizUpdateSchame,
} from "../../schemas/quiz.schema";

export const quizController = {
  async create(
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const userId = request.userIdToken;
      const { title, description, visibility, flashcardList } = request.body;

      if (!userId) throw new NotLoggedError();

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
        quizId: id,
        dataToUpdateQuiz: quizPartial,
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

  async addFlashcardToQuiz(
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ) {
    try {
      console.log("aquiii");
      const userIdToken = request.userIdToken;
      if (!userIdToken) throw new NotLoggedError();
      console.log("🚀 ~ request.body:", request.body);

      const { id } = request.params;
      const idSchema = z.string();
      idSchema.parse(id);

      const { term, description } = request.body;
      flashcardSchema.parse({ term, description });

      console.log("🚀 ~ id:", id);
      console.log("🚀 ~ { term, description }:", { term, description });

      const Createdflashcard = await quizUseCase.addFlashcardToQuiz({
        quizId: id,
        flashcard: { term, description },
      });

      if (!Createdflashcard) throw new Error("erro depois do useCase");

      return response.status(201).json({
        sucess: true,
        data: Createdflashcard,
        message: "novo flashcard adicionado com sucesso",
      });
    } catch (error) {
      console.error("🚀 controller - addFlashcardToQuiz ~ error:", error);
      next(error);
    }
  },
};
