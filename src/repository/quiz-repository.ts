import { QuizDTO } from "../domain/dto/quiz.model.DTO";
import { Quiz, Visibility } from "../domain/model/quiz.model";

const quizzes: Quiz[] = [];

export const quizRepository = {
  create(quiz: Quiz) {
    quizzes.push(quiz);

    return { quiz: quiz.toObject() };
  },

  findAllFromUser(userId: string) {
    const quizListFromUser = quizzes.filter((quiz) => userId == quiz.userId);

    if (!quizListFromUser) return null;

    return { quiz: quizListFromUser };
  },

  findAllPublicQuiz() {
    const quizListPublic = quizzes.filter(
      (quiz) => Visibility.PUBLIC === quiz.getVisibility(),
    );
    if (!quizListPublic) return null;

    return { quiz: quizListPublic };
  },

  findById(quizId: String) {
    const foundQuizById = quizzes.find((quiz) => quiz.id === quizId);

    if (!foundQuizById) return null;

    return { quiz: foundQuizById.toObject() };
  },

  update({
    quizId,
    dataToUpdateQuiz,
  }: {
    quizId: string;
    dataToUpdateQuiz: Partial<QuizDTO>;
  }) {
    const foundQuizById = quizzes.find((quiz) => quiz.id === quizId);

    if (!foundQuizById) return null;

    if (dataToUpdateQuiz.title !== undefined) {
      foundQuizById.setTitle(dataToUpdateQuiz.title);
    }

    if (dataToUpdateQuiz.description !== undefined) {
      foundQuizById.setDescription(dataToUpdateQuiz.description);
    }

    if (dataToUpdateQuiz.visibility !== undefined) {
      foundQuizById.setVisibility(dataToUpdateQuiz.visibility);
    }

    return { quiz: foundQuizById.toObject() };
  },

  delete(quizId: string) {
    const quizIndexInQuizzes = quizzes.findIndex((quiz) => quiz.id === quizId);

    if (quizIndexInQuizzes === -1) return null;

    const deletedQuiz = quizzes.splice(quizIndexInQuizzes, 1)[0];
    return { quiz: deletedQuiz.toObject() };
  },
};
