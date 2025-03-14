import { StudySessionDTO } from "../../domain/dto/studySession.model.DTO";
import { StudySession } from "../../domain/model/studySession.model";
import { NotFoundError, RequestDataMissingError } from "../../erros/errors";
import { studySessionRepository } from "../../repository/studySession-repositoy";
import { quizUseCase } from "../quiz/quiz-useCases";

export const studySessionUseCases = {
  async create(studySessionData: Partial<StudySessionDTO>) {
    try {
      const { userId, quizId } = studySessionData;

      if (!userId || !quizId) throw new RequestDataMissingError();

      const foundQuizById = await quizUseCase.findById(quizId);
      if (!foundQuizById) throw new NotFoundError("quiz");

      const flashcardList = foundQuizById.quiz.getFlashcardList();
      if (!flashcardList) throw new NotFoundError("lista de flashcards");

      const studySessionObj = new StudySession({
        userId,
        quizId,
        flashcardList,
      });
      if (!studySessionObj) throw new Error("Erro ao criar object");

      const CreatedStudySession = await studySessionRepository.create(
        studySessionObj,
      );

      if (!CreatedStudySession) throw new Error();

      return CreatedStudySession;
    } catch (error) {
      console.error("studySessionUseCases - create - error: ", error);
      throw error;
    }
  },

  async getById(studySessionId: string) {
    try {
      if (!studySessionId) throw new RequestDataMissingError();


      const FoundStudySessionById = await studySessionRepository.getById(studySessionId);

      if (!FoundStudySessionById) throw new NotFoundError('sessão de estudo');

      return FoundStudySessionById;
    } catch (error) {
      console.error("studySessionUseCases - getById - error: ", error);
      throw error;
    }
  },
};
