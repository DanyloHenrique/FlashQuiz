import { QuizDTO } from "../domain/dto/quiz.model.DTO";
import { Quiz, Visibility } from "../domain/model/quiz.model";

const quizzes: Quiz[] = [];

export const quizRepository = {
  create(quiz: Quiz) {
    quizzes.push(quiz);

    console.log("🚀 ~ create ~ quiz:", quiz);
    return { quiz: quiz.toObject() };
  },

  findAllFromUser(userId: string) {
    const quizListFromUser = quizzes.filter((quiz) => userId == quiz.userId);

    if (!quizListFromUser) return null;

    return { data: quizListFromUser };
  },

  findAllPublicQuiz() {
    const quizListPublic = quizzes.filter(
      (quiz) => Visibility.PUBLIC === quiz.getVisibility(),
    );
    if (!quizListPublic) return null;

    return { data: quizListPublic };
  },

  findById(quizId: String) {
    const foundQuizById = quizzes.find((quiz) => quiz.id === quizId);

    if (!foundQuizById) return null;

    return { data: foundQuizById.toObject() };
  },
  update({ id, quizData }: { id: string; quizData: Partial<QuizDTO> }) {
    const quiz = quizzes.find((quiz) => quiz.id === id); // Busca pelo e-mail no array

    if (!quiz) {
      return null;
    }

    if (quizData.title !== undefined) {
      quiz.setTitle(quizData.title);
    }

    if (quizData.description !== undefined) {
      quiz.setDescription(quizData.description);
    }

    if (quizData.visibility !== undefined) {
      quiz.setVisibility(quizData.visibility);
    }

    return { quiz: quiz.toObject() };
  },
  delete(quizId: string) {
    const quizIndexInQuizzes = quizzes.findIndex((quiz) => quiz.id === quizId);

    if (quizIndexInQuizzes === -1) {
      return null;
    }

    const deletedQuiz = quizzes.splice(quizIndexInQuizzes, 1)[0];
    return { quiz: deletedQuiz.toObject() };
  },
};
