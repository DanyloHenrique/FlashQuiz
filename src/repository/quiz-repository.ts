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
    const foundQuizById = quizzes.find((quiz) => quiz.id === quizId)

    if(!foundQuizById) return null

     return {data: foundQuizById.toObject()}
  },
  update(quiz: Quiz) {
    // return {data: updatedQuiz}
  },
  delete(id: string) {
    // return {data: deletedQuiz}
  },
};
