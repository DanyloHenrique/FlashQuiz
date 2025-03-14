import { StudySessionDTO } from "../../domain/dto/studySession.model.DTO";
import { Status, StudySession } from "../../domain/model/studySession.model";
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

      const FoundStudySessionById = await studySessionRepository.getById(
        studySessionId,
      );

      if (!FoundStudySessionById) throw new NotFoundError("sessão de estudo");

      return FoundStudySessionById;
    } catch (error) {
      console.error("studySessionUseCases - getById - error: ", error);
      throw error;
    }
  },

  async updateStatus(studySessionId: string, statusUpdate: Status) {
    try {
      if (!studySessionId) throw new RequestDataMissingError();

      const FoundStudySessionById = await studySessionRepository.getById(
        studySessionId,
      );
      if (!FoundStudySessionById) throw new NotFoundError("sessão de estudo");

      const currentStatus = FoundStudySessionById.studySession.getStatus();

      if (currentStatus === Status.COMPLETED)
        throw new Error(
          "Sessão de estudo já completada, não é possível atualizar o status",
        );
      if (currentStatus === statusUpdate) throw new Error("Status iguais");

      const studySessionUpdated = await studySessionRepository.updateStatus({
        statusUpdate: statusUpdate,
        studySession: FoundStudySessionById.studySession,
      });

      if (!studySessionUpdated) throw new Error();

      return studySessionUpdated;
    } catch (error) {
      console.error("studySessionUseCases - getById - error: ", error);
      throw error;
    }
  },
};
