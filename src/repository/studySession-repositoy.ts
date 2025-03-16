import { Flashcard } from "../domain/model/flashcard.model";
import { Status, StudySession } from "../domain/model/studySession.model";
import prisma from "../lib/prismaClient";

const studySessionList: StudySession[] = [];

export const studySessionRepository = {
  async create(studySession: StudySession) {
    if (!studySession) return null;

    const dataCreate = {
      id: studySession.id,
      userId: studySession.userId,
      quizId: studySession.quizId,
      status: studySession.getStatus(),
      startTime: studySession.startTime,
      StudySessionFlashcard: {
        create: studySession.getFlashcardList().map((flashcard) => ({
          flashcardId: flashcard.id,
        })),
      },
    };

    const studySessionCreated = await prisma.studySession.create({
      data: dataCreate,
      include: {
        StudySessionFlashcard: {
          include: { flashcard: true },
        },
      },
    });

    const { id, quizId, userId, StudySessionFlashcard } = studySessionCreated;
    const flashcardList = StudySessionFlashcard.map(
      (sessionFlashcard) =>
        new Flashcard({
          id: sessionFlashcard.flashcard.id,
          term: sessionFlashcard.flashcard.term,
          description: sessionFlashcard.flashcard.description,
        }),
    );

    const studyObjResult = new StudySession({
      id,
      quizId,
      userId,
      flashcardList: flashcardList,
    });

    return { studySession: studyObjResult.toObject() };
  },

  async getById(studySessionId: string) {
    const foundStudySession = await prisma.studySession.findUnique({
      where: {
        id: studySessionId,
      },
      include: {
        StudySessionFlashcard: {
          include: { flashcard: true },
        },
        flashcardViewLaterList: {
          include: { flashcard: true },
        },
      },
    });

    if (!foundStudySession) return null;

    const {
      id,
      quizId,
      userId,
      StudySessionFlashcard,
      status,
      flashcardViewLaterList,
    } = foundStudySession;
    const flashcardList = StudySessionFlashcard.map(
      (sessionFlashcard) =>
        new Flashcard({
          id: sessionFlashcard.flashcard.id,
          term: sessionFlashcard.flashcard.term,
          description: sessionFlashcard.flashcard.description,
        }),
    );
    const flashcardViewLater = flashcardViewLaterList.map(
      (sessionFlashcard) =>
        new Flashcard({
          id: sessionFlashcard.flashcard.id,
          term: sessionFlashcard.flashcard.term,
          description: sessionFlashcard.flashcard.description,
        }),
    );

    const studyObjResult = new StudySession({
      id,
      quizId,
      userId,
      flashcardList: flashcardList,
      status: status as Status,
      flashcardViewLaterList: flashcardViewLater,
    });

    return { studySession: studyObjResult };
  },

  async updateStatus({
    statusUpdate,
    studySession,
  }: {
    statusUpdate: Status;
    studySession: StudySession;
  }) {
    if (!statusUpdate || !studySession) return null;

    console.log("🚀 ~ statusUpdate:", statusUpdate);

    const studySessionUpdated = await prisma.studySession.update({
      where: {
        id: studySession.id,
      },
      data: {
        status: {
          set: statusUpdate,
        },
      },
      include: {
        StudySessionFlashcard: {
          include: { flashcard: true },
        },
        flashcardViewLaterList: {
          include: { flashcard: true },
        },
      },
    });

    if (!studySessionUpdated) return null;

    const { id, quizId, userId, StudySessionFlashcard, status } =
      studySessionUpdated;

    const flashcardList = StudySessionFlashcard.map(
      (sessionFlashcard) =>
        new Flashcard({
          id: sessionFlashcard.flashcard.id,
          term: sessionFlashcard.flashcard.term,
          description: sessionFlashcard.flashcard.description,
        }),
    );

    const studyObjResult = new StudySession({
      id,
      quizId,
      userId,
      flashcardList: flashcardList,
      status: status as Status,
    });

    return { studySession: studyObjResult.toObject() };
  },

  async addFlashcardToViewLater({
    flashcardAdd,
    studySession,
  }: {
    flashcardAdd: Flashcard;
    studySession: StudySession;
  }) {
    if (!flashcardAdd || !studySession) return null;

    const addedViewLater = await prisma.viewLaterFlashcard.create({
      data: {
        studySessionId: studySession.id,
        flashcardId: flashcardAdd.id,
      },
    });

    const foundStudySession = await prisma.studySession.findUnique({
      where: { id: studySession.id },
      include: {
        StudySessionFlashcard: {
          include: { flashcard: true },
        },
        flashcardViewLaterList: {
          include: { flashcard: true },
        },
      },
    });

    studySession.setFlashcardViewLaterList(flashcardAdd);

    if (!foundStudySession) return null;

    const {
      id,
      quizId,
      userId,
      StudySessionFlashcard,
      flashcardViewLaterList,
    } = foundStudySession;

    const flashcardList = StudySessionFlashcard.map(
      (sessionFlashcard) =>
        new Flashcard({
          id: sessionFlashcard.flashcard.id,
          term: sessionFlashcard.flashcard.term,
          description: sessionFlashcard.flashcard.description,
        }),
    );

    const flashcardViewLater = flashcardViewLaterList.map(
      (sessionFlashcard) =>
        new Flashcard({
          id: sessionFlashcard.flashcard.id,
          term: sessionFlashcard.flashcard.term,
          description: sessionFlashcard.flashcard.description,
        }),
    );

    const studyObjResult = new StudySession({
      id,
      quizId,
      userId,
      flashcardList: flashcardList,
      flashcardViewLaterList: flashcardViewLater,
    });

    return { flashcardToViewList: studyObjResult.getFlashcardViewLaterList() };
  },

  async deleteFlashcardToViewLater({
    flashcardDeleteId,
    studySessionId,
  }: {
    flashcardDeleteId: string;
    studySessionId: string;
  }) {
    if (!flashcardDeleteId || !studySessionId) return null;

    const flashcardDeleted = await prisma.viewLaterFlashcard.delete({
      where: {
        studySessionId_flashcardId: {
          flashcardId: flashcardDeleteId,
          studySessionId: studySessionId,
        },
      },
    });

    if (!flashcardDeleted) return null;

    const { flashcardId } = flashcardDeleted;
    const flashcardDeletedFound = await prisma.flashcard.findUnique({
      where: {
        id: flashcardId,
      },
      select: {
        id: true,
        term: true,
        description: true,
      },
    });
    if (!flashcardDeletedFound) return null;
    const { id, term, description } = flashcardDeletedFound;
    const flashcardObjResult = new Flashcard({ id, term, description });

    return { deletedFlashcard: flashcardObjResult.toObject() };
  },

  async finishStudySession({ studySession }: { studySession: StudySession }) {
    if (!studySession) return null;

    const millisecondsForMinutes = 1000 * 60;

    const endTimeFinish = new Date();
    const totalTimeInMinutesFinish =
      (endTimeFinish.getTime() - studySession.startTime.getTime()) /
      millisecondsForMinutes;

    // Atualiza o status da sessão de estudo para 'COMPLETED'
    const finishedStudySession = await prisma.studySession.update({
      where: { id: studySession.id },
      data: {
        status: Status.COMPLETED,
        endTime: endTimeFinish, // opcional: salvar o tempo de término
        totalTimeInMinutes: totalTimeInMinutesFinish,
      },
    });

    if (!finishedStudySession) return null;

    const { endTime, totalTimeInMinutes, status } = finishedStudySession;
    studySession.setStatus(status as Status);
    studySession.setEndTime(endTime || undefined);
    studySession.setTotalTime(totalTimeInMinutes || undefined);

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
