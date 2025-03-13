import { Response, NextFunction } from "express";
import { z } from "zod";

import { AuthenticatedRequest } from "../../middleware/authenticateToken";
import { NotFoundError, NotLoggedError } from "../../erros/errors";
import { flashcardUpdateSchema } from "../../schemas/quiz.schema";
import { FlashcardDTO } from "../../domain/dto/flashcard.model.DTO";
import { flashcardUseCase } from "../../useCases/flashcard/flashcard-useCases";

export const flashcardController = {
  async update(
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const userIdToken = request.userIdToken;
      const flashcardRequest = request.body;
      const { quizId, flashcardId } = request.params;

      if (!userIdToken) throw new NotLoggedError();
      const idSchema = z.string();
      idSchema.parse(quizId);
      idSchema.parse(flashcardId);

      const validatedFlashcardRequest =
        flashcardUpdateSchema.parse(flashcardRequest);

      const flashcardPartial: Partial<FlashcardDTO> = validatedFlashcardRequest;

      const flashcardUpdated = await flashcardUseCase.update({
        quizId: quizId,
        flashcardId: flashcardId,
        dataFlashcardToUpdateData: flashcardPartial,
      });

      if (!flashcardUpdated) throw new Error();

      return response.status(200).json({
        sucess: true,
        data: flashcardUpdated,
        message: "Flashcard atualizado com sucesso",
      });
    } catch (error) {
      console.error(
        "flashcard-controller.ts - update",
        " :: Error ❌ : ",
        error,
      );
      next(error);
    }
  },
};
