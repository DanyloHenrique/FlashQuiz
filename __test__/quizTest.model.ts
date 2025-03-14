import { uuid } from "uuidv4";
import { QuizDTO } from "../src/domain/dto/quiz.model.DTO";
import { Quiz, Visibility } from "../src/domain/model/quiz.model";

jest.useFakeTimers().setSystemTime(new Date("2025-03-12T04:37:32.496Z"));

export const quizTestDTO: QuizDTO = {
  title: "Backend com Node.js",
  visibility: Visibility.PUBLIC,
  description: "Quiz para testar meu conhecimento em Node",
  userId: uuid(),
  flashcardList: [
    {
      term: "Node.js",
      description:
        "Ambiente de desenvolvimento que permite usar javascript no backend",
    },
  ],
};

export const quizTestObj = new Quiz(quizTestDTO);
