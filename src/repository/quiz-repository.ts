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

    if (quizListFromUser.length === 0) return null;

    return { quiz: quizListFromUser.map((quiz) => quiz.toObject()) };
  },

  findAllPublicQuiz() {
    const quizListPublic = quizzes.filter(
      (quiz) => Visibility.PUBLIC === quiz.getVisibility(),
    );

    if (quizListPublic.length === 0) return null;

    return { quiz: quizListPublic.map((quiz) => quiz.toObject()) };
  },

  findById(quizId: String) {
    const foundQuizById = quizzes.find((quiz) => quiz.id === quizId);

    if (!foundQuizById) return null;

    return { quiz: foundQuizById };
  },

  update({
    dataCurrentQuiz,
    dataToUpdateQuiz,
  }: {
    dataCurrentQuiz: Quiz;
    dataToUpdateQuiz: Partial<QuizDTO>;
  }) {
    if (!dataCurrentQuiz || !dataToUpdateQuiz) return null;

    if (dataToUpdateQuiz.title !== undefined) {
      dataCurrentQuiz.setTitle(dataToUpdateQuiz.title);
    }

    if (dataToUpdateQuiz.description !== undefined) {
      dataCurrentQuiz.setDescription(dataToUpdateQuiz.description);
    }

    if (dataToUpdateQuiz.visibility !== undefined) {
      dataCurrentQuiz.setVisibility(dataToUpdateQuiz.visibility);
    }

    return { quiz: dataCurrentQuiz.toObject() };
  },

  delete(quizId: string) {
    const quizIndexInQuizzes = quizzes.findIndex((quiz) => quiz.id === quizId);

    if (quizIndexInQuizzes === -1) return null;

    const deletedQuiz = quizzes.splice(quizIndexInQuizzes, 1)[0];
    return { quiz: deletedQuiz.toObject() };
  },
};
