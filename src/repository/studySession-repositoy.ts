import { StudySessionDTO } from "../domain/dto/studySession.model.DTO";
import { Flashcard } from "../domain/model/flashcard.model";
import { Status, StudySession } from "../domain/model/studySession.model";

const studySessionList: StudySession[] = [];

export const studySessionRepository = {
  async create(studySession: StudySession) {
    if (!studySession) return null;

    studySessionList.push(studySession);

    return { studySession: studySession.toObject() };
  },

  async getById(studySessionId: string) {
    const foundStudySessionById = studySessionList.find(
      (studySession) => studySession.id === studySessionId,
    );

    if (!foundStudySessionById) return null;

    return { studySession: foundStudySessionById };
  },

  updateStatus({
    statusUpdate,
    studySession,
  }: {
    statusUpdate: Status;
    studySession: StudySession;
  }) {
    if (!statusUpdate || !studySession) return null;

    studySession.setStatus(statusUpdate);

    return { studySession: studySession.toObject() };
  },

  async addFlashcardToViewLater({
    flashcardAdd,
    studySession,
  }: {
    flashcardAdd: Flashcard;
    studySession: StudySession;
  }) {
    if (!flashcardAdd || !studySession) return null;

    studySession.setFlashcardViewLaterList(flashcardAdd);

    return { flashcardToViewList: studySession.getFlashcardViewLaterList() };
  },
};
