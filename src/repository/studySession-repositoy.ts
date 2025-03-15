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

  async updateStatus({
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

  async deleteFlashcardToViewLater({
    flashcardDeleteId,
    flashcardViewLaterList,
  }: {
    flashcardDeleteId: string;
    flashcardViewLaterList: Flashcard[];
  }) {
    if (!flashcardDeleteId || !flashcardViewLaterList) return null;

    const flashcardIndexInList = flashcardViewLaterList.findIndex(
      (flashcard) => flashcard.id === flashcardDeleteId,
    );

    if (flashcardIndexInList === -1) return null;

    const deletedFlashcard = flashcardViewLaterList.splice(
      flashcardIndexInList,
      1,
    )[0];

    return { deletedFlashcar: deletedFlashcard.toObject() };
  },

  async finishStudySession({ studySession }: { studySession: StudySession }) {
    if (!studySession) return null;

    studySession.setStatus(Status.COMPLETED);
    studySession.setEndTime();
    studySession.setTotalTime();

    return { studySession: studySession.toObject() };
  },

  async isFinish(studySession: StudySession) {
    if (!studySession) return null;

    if (studySession.getStatus() === Status.COMPLETED) {
      return true;
    } else {
      return false;
    }
  },
};
