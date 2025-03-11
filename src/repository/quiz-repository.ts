import { Quiz } from "../domain/model/quiz.model";

const quizzes: Quiz[] = [];

export const quizRepository = {
  create(quiz: Quiz) {
    quizzes.push(quiz);

    console.log("🚀 ~ create ~ quiz:", quiz);
    return { quiz: quiz.toObject() };
  },
  findAll() {
    return { data: quizzes };
  },
  findById(id: string) {
    // return {data: foundedQuiz.toObject()}
  },
  update(quiz: Quiz) {
    // return {data: updatedQuiz}
  },
  delete(id: string) {
    // return {data: deletedQuiz}
  },
};
