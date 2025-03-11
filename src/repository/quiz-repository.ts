import { QuizDTO } from "../domain/dto/quiz.model.DTO";
import { Quiz } from "../domain/model/quiz.model";

const quizzes: Quiz[] = [];

export const quizRepository = {
  create(quiz: Quiz) {
    return { data: quiz.toObject() };
  },
  findAll() {
    return {data: quizzes}
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
