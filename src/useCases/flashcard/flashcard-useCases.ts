import { FlashcardDTO } from "../../domain/dto/flashcard.model.DTO";
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
      const { term, description } = dataFlashcardToUpdateData;

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
        flashcardToUpdateData: { term, description },
      });

      if (!flashcardUpdated) throw new Error();

      return flashcardUpdated;
    } catch (error) {
      throw error;
    }
  },

  async delete({
    quizId,
    flashcardId,
  }: {
    quizId: string;
    flashcardId: string;
  }) {
    try {
      if (!quizId || !flashcardId) {
        throw new RequestDataMissingError();
      }
      console.log("🚀 ~ quizId:", quizId);

      const foundQuizById = await quizRepository.findById(quizId);
      if (!foundQuizById) throw new NotFoundError("quiz");

      const flashcardList = foundQuizById.quiz.getFlashcardList();
      if (!flashcardList) throw new Error("lista de flashcard vazia");

      const flashcardDeleted = await flashcardRepository.delete({
        flashcardId: flashcardId,
        flashcardList: flashcardList,
      });

      if (!flashcardDeleted) throw new Error();

      return flashcardDeleted;
    } catch (error) {
      throw error;
    }
  },
};
