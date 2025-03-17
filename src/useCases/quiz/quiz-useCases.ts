import { error } from "console";
import { FlashcardDTO } from "../../domain/dto/flashcard.model.DTO";
import { QuizDTO } from "../../domain/dto/quiz.model.DTO";
import { Quiz } from "../../domain/model/quiz.model";
import { NotFoundError, RequestDataMissingError } from "../../erros/errors";
import { quizRepository } from "../../repository/quiz-repository";

export const quizUseCase = {
  async create({
    userId,
    title,
    description,
    visibility,
    flashcardList,
  }: QuizDTO) {
    try {
      if (!userId || !title) throw new RequestDataMissingError();

      const quizObj = new Quiz({
        userId,
        title,
        description,
        visibility,
        flashcardList,
      });

      const createdQuiz = await quizRepository.create(quizObj);

      if (!createdQuiz) throw new Error();

      return createdQuiz;
    } catch (error) {
      throw error;
    }
  },

  async findAllFromUser(userId: string) {
    if (!userId) throw new RequestDataMissingError();

    const findedAllQuizFromUser = await quizRepository.findAllFromUser(userId);

    if (!findedAllQuizFromUser) throw new NotFoundError("quiz");

    return findedAllQuizFromUser;
  },

  async findAllPublic() {
    const findedAllQuizFromUser = await quizRepository.findAllPublicQuiz();

    if (!findedAllQuizFromUser) throw new NotFoundError();

    return findedAllQuizFromUser;
  },

  async findById(quizId: string) {
    try {
      if (!quizId) throw new RequestDataMissingError();

      const foundQuizById = await quizRepository.findById(quizId);

      if (!foundQuizById) throw new NotFoundError("quiz");

      return foundQuizById;
    } catch (error) {
      console.error("quiz-useCases.ts - findById", " :: Error ❌ : ", error);
      throw error;
    }
  },

  async update({
    quizId,
    dataToUpdateQuiz,
  }: {
    quizId: string;
    dataToUpdateQuiz: Partial<QuizDTO>;
  }) {
    try {
      const { title, description, visibility } = dataToUpdateQuiz;

      if (!title && !description && !visibility)
        throw new RequestDataMissingError();

      const FoundQuizCurrentById = await quizRepository.findById(quizId);
      if (!FoundQuizCurrentById) throw new NotFoundError("quiz");

      const updatedQuiz = await quizRepository.update({
        dataCurrentQuiz: FoundQuizCurrentById.quiz,
        dataToUpdateQuiz: { title, description, visibility },
      });

      if (!updatedQuiz) throw new Error();

      return updatedQuiz;
    } catch (error) {
      throw error;
    }
  },

  async delete(quizId: string) {
    try {
      if (!quizId) throw new RequestDataMissingError();

      const foundQuizById = await quizRepository.findById(quizId);
      if (!foundQuizById) throw new NotFoundError("quiz");

      const deletedQuiz = await quizRepository.delete(quizId);
      if (!deletedQuiz) throw new Error();

      return deletedQuiz;
    } catch (error) {
      console.error("quiz-useCases.ts", " :: Error ❌ : ", error);
      throw error;
    }
  },

  async addFlashcardToQuiz({
    quizId,
    flashcard,
  }: {
    quizId: string;
    flashcard: FlashcardDTO;
  }) {
    try {
      if (!quizId || !flashcard) throw new RequestDataMissingError();

      const foundQuizById = await quizRepository.findById(quizId);
      if (!foundQuizById) throw new NotFoundError("quiz");

      const createdQuizFlashcard = await quizRepository.addFlashcardToQuiz({
        quizObj: foundQuizById.quiz,
        newFlashcard: flashcard,
      });

      if (!createdQuizFlashcard) throw new NotFoundError("quiz");

      return createdQuizFlashcard;
    } catch (error) {
      console.error("quiz-useCases.ts", " :: Error ❌ : ", error);
      throw error;
    }
  },

  async addMultipleFlashcardToQuiz({
    quizId,
    flashcardList,
  }: {
    quizId: string;
    flashcardList: FlashcardDTO[];
  }) {
    try {
      if (!quizId || !flashcardList) throw new RequestDataMissingError();
      console.log("🚀 ~ quizId:", quizId);
      console.log("🚀 ~ flashcard:", flashcardList);

      const foundQuizById = await quizRepository.findById(quizId);
      if (!foundQuizById) throw new NotFoundError("quiz");

      const createdQuizFlashcard =
        await quizRepository.addMultipleFlashcardToQuiz({
          quizObj: foundQuizById.quiz,
          newsFlashcard: flashcardList,
        });

      if (!createdQuizFlashcard) throw new NotFoundError("quiz");

      return createdQuizFlashcard;
    } catch (error) {
      console.error("quiz-useCases.ts", " :: Error ❌ : ", error);
      throw error;
    }
  },
};
