import { StudySessionDTO } from "../domain/dto/studySession.model.DTO";
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
};
