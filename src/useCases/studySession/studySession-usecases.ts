import { StudySessionDTO } from "../../domain/dto/studySession.model.DTO";
import { Status, StudySession } from "../../domain/model/studySession.model";
import {
  AppError,
  NotFoundError,
  RequestDataMissingError,
} from "../../erros/errors";
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
      if (flashcardList.length === 0)
        throw new AppError(
          "Não é possível iniciar a sessão de estudo para um quiz sem flashcards",
        );

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

      if (currentStatus === statusUpdate) throw new AppError("Status iguais");

      if (statusUpdate === Status.COMPLETED) {
        return this.finishStudySession(studySessionId);
      }

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

  async addFlashcardToViewLater(
    studySessionId: string,
    flashcardAddId: string,
  ) {
    try {
      if (!studySessionId || !flashcardAddId)
        throw new RequestDataMissingError();

      const FoundStudySessionById = await studySessionRepository.getById(
        studySessionId,
      );
      if (!FoundStudySessionById) throw new NotFoundError("sessão de estudo");

      const studySession = FoundStudySessionById.studySession;

      const isFinish = studySession.isFinish();
      if (isFinish) throw new AppError("Sessão de estudo já completada");

      const flashcardAdd = studySession.getFlashcardUnique(flashcardAddId);
      if (!flashcardAdd) throw new NotFoundError("flashcard");

      const updatedFlashcardToViewList =
        await studySessionRepository.addFlashcardToViewLater({
          flashcardAdd: flashcardAdd,
          studySession: studySession,
        });

      return updatedFlashcardToViewList;
    } catch (error) {
      console.error("studySessionUseCases - addFlashcardToViewList: ", error);
      throw error;
    }
  },

  async deleteFromFlashcardToViewLater(
    studySessionId: string,
    flashcardDeleteId: string,
  ) {
    try {
      if (!studySessionId || !flashcardDeleteId)
        throw new RequestDataMissingError();

      const FoundStudySessionById = await studySessionRepository.getById(
        studySessionId,
      );
      if (!FoundStudySessionById) throw new NotFoundError("sessão de estudo");

      const studySession = FoundStudySessionById.studySession;

      const isFinish = studySession.isFinish();
      if (isFinish) throw new AppError("Sessão de estudo já completada");

      const FoundFlashcardViewLaterList =
        studySession.getFlashcardViewLaterList();
      if (FoundFlashcardViewLaterList.length === 0)
        throw new Error("Nenhum flashcard na lista de ver depois");

      const deletedFlashcardToViewList =
        await studySessionRepository.deleteFlashcardToViewLater({
          flashcardDeleteId: flashcardDeleteId,
          studySessionId: studySessionId,
        });

      if (!deletedFlashcardToViewList)
        throw new Error("Erro ao remover o flashcard da lista de ver depois");

      return deletedFlashcardToViewList;
    } catch (error) {
      // console.error("studySessionUseCases - addFlashcardToViewList: ", error);
      throw error;
    }
  },

  async finishStudySession(studySessionId: string) {
    try {
      if (!studySessionId) throw new RequestDataMissingError();

      const FoundStudySessionById = await studySessionRepository.getById(
        studySessionId,
      );
      if (!FoundStudySessionById) throw new NotFoundError("sessão de estudo");
      const studySession = FoundStudySessionById.studySession;

      const isFinish = studySession.isFinish();
      if (isFinish) throw new AppError("Sessão de estudo já completada");

      const finishedStudySession =
        await studySessionRepository.finishStudySession({
          studySession: studySession,
        });

      if (!finishedStudySession) throw new Error();

      return finishedStudySession;
    } catch (error) {
      console.error("studySessionUseCases - getById - error: ", error);
      throw error;
    }
  },
};
