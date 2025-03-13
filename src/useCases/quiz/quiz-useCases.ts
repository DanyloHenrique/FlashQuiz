import { QuizDTO } from "../../domain/dto/quiz.model.DTO";
import { Flashcard } from "../../domain/model/flashcard.model";
import { Quiz } from "../../domain/model/quiz.model";
import { NotFoundError, RequestDataMissingError } from "../../erros/errors";
import { quizRepository } from "../../repository/quiz-repository";

export const quizUseCase = {
  create({ userId, title, description, visibility, flashcardList }: QuizDTO) {
    console.log("🚀 ~ create ~ flashcardList:", flashcardList);
    try {
      if (!userId || !title) throw new RequestDataMissingError();

      const quizObj = new Quiz({
        userId,
        title,
        description,
        visibility,
        flashcardList,
      });
      console.log("🚀 ~ create ~ quizObj:", quizObj);

      const createdQuiz = quizRepository.create(quizObj);
      console.log("🚀 ~ create ~ createdQuiz:", createdQuiz);

      if (!createdQuiz) throw new Error();

      return createdQuiz;
    } catch (error) {
      throw error;
    }
  },

  async findAllFromUser(userId: string) {
    if (!userId) throw new RequestDataMissingError();

    const findedAllQuizFromUser = await quizRepository.findAllFromUser(userId);

    if (!findedAllQuizFromUser) throw new NotFoundError();

    return findedAllQuizFromUser;
  },

  async findAllPublic() {
    const findedAllQuizFromUser = await quizRepository.findAllPublicQuiz();

    if (!findedAllQuizFromUser) throw new NotFoundError();

    return findedAllQuizFromUser;
  },

  async findById(quizId: String) {
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
};
