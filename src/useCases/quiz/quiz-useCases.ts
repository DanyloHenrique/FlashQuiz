import { QuizDTO } from "../../domain/dto/quiz.model.DTO";
import { Flashcard } from "../../domain/model/flashcard.model";
import { Quiz } from "../../domain/model/quiz.model";
import { RequestDataMissingError } from "../../erros/errors";
import { quizRepository } from "../../repository/quiz-repository";

export const quizUseCase = {
  create({ userId, title, description, visibility, flashCard }: QuizDTO) {
    try {
      if (!userId || !title) throw new RequestDataMissingError();
      
      const quizObj = new Quiz({
        userId,
        title,
        description,
        visibility,
        flashCard,
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
};
