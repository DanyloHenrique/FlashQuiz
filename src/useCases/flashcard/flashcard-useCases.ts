import { FlashcardDTO } from "../../domain/dto/flashcard.model.DTO";
import { QuizDTO } from "../../domain/dto/quiz.model.DTO";
import { Quiz } from "../../domain/model/quiz.model";
import { NotFoundError, RequestDataMissingError } from "../../erros/errors";
import { flashcardRepository } from "../../repository/flashcard-repository";
import { quizRepository } from "../../repository/quiz-repository";

export const flashcardUseCase = {
  async update({
    quizId,
    flashcardId,
    dataFlashcardToUpdateData,
  }: {
    quizId: string;
    flashcardId: string;
    dataFlashcardToUpdateData: Partial<FlashcardDTO>;
  }) {
    try {
      if (!quizId || !flashcardId || !dataFlashcardToUpdateData) {
        throw new RequestDataMissingError();
      }

      const foundQuizById = await quizRepository.findById(quizId);
      if (!foundQuizById) throw new NotFoundError("quiz");

      const flashcardList = foundQuizById.quiz.getFlashcardList();
      if (!flashcardList) throw new Error("lista de flashcard vazia");

      const flashcard = flashcardList.find(
        (flashcard) => flashcard.id === flashcardId,
      );
      if (!flashcard) throw new NotFoundError("flashcard");

      const flashcardUpdated = await flashcardRepository.update({
        flashcardCurrentData: flashcard,
        flashcardToUpdateData: dataFlashcardToUpdateData,
      });

      if (!flashcardUpdated) throw new Error();

      return flashcardUpdated;
    } catch (error) {
      throw error;
    }
  },
};
