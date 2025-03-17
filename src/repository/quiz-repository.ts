import { FlashcardDTO } from "../domain/dto/flashcard.model.DTO";
import { QuizDTO } from "../domain/dto/quiz.model.DTO";
import { Flashcard } from "../domain/model/flashcard.model";
import { Quiz, Visibility } from "../domain/model/quiz.model";
import { $Enums } from "@prisma/client";
import prisma from "../lib/prismaClient";

const quizzes: Quiz[] = [];

export const quizRepository = {
  async create(quiz: Quiz) {
    const quizCreated = await prisma.quiz.create({
      data: {
        id: quiz.id,
        userId: quiz.userId,
        title: quiz.getTitle(),
        description: quiz.getDescription(),
        create_at: quiz.create_at,
        flashcardList: {
          create: quiz.getFlashcardList().map((flashcard) => ({
            term: flashcard.getTerm(),
            description: flashcard.getDescription(),
          })),
        },
        visibility: quiz ? quiz.getVisibility() : undefined,
      },
      include: { flashcardList: true },
    });

    const { userId, title, description, visibility, flashcardList, id } =
      quizCreated;

    const quizObjResult = new Quiz({
      userId,
      title,
      description: description ?? undefined,
      visibility: visibility as Visibility,
      flashcardList,
      id,
    });

    return { quiz: quizObjResult.toObject() };
  },

  async findAllFromUser(userId: string) {
    const foundQuizByUser = await prisma.quiz.findMany({
      where: {
        userId: userId,
      },
      include: { flashcardList: true },
    });

    if (foundQuizByUser.length === 0) return null;

    const listQuizObj: Quiz[] = foundQuizByUser.map((quiz) => {
      const { userId, title, description, visibility, flashcardList, id } =
        quiz;

      return new Quiz({
        userId,
        title,
        description: description ?? undefined,
        visibility: visibility as Visibility,
        flashcardList,
        id,
      });
    });

    return { quiz: listQuizObj.map((quiz) => quiz.toObject()) };
  },

  async findAllPublicQuiz() {
    const quizListPublic = await prisma.quiz.findMany({
      where: {
        visibility: Visibility.PUBLIC,
      },
      include: { flashcardList: true },
    });
    if (quizListPublic.length === 0) return null;

    const listQuizObj: Quiz[] = quizListPublic.map((quiz) => {
      const { userId, title, description, visibility, flashcardList, id } =
        quiz;

      return new Quiz({
        userId,
        title,
        description: description ?? undefined,
        visibility: visibility as Visibility,
        flashcardList,
        id,
      });
    });

    return { quiz: listQuizObj.map((quiz) => quiz.toObject()) };
  },

  async findById(quizId: string) {
    const foundQuizById = await prisma.quiz.findUnique({
      where: {
        id: quizId,
      },
      include: { flashcardList: true },
    });
    if (!foundQuizById) return null;

    const { userId, title, description, visibility, flashcardList, id } =
      foundQuizById;

    const quizObjResult = new Quiz({
      userId,
      title,
      description: description ?? undefined,
      visibility: visibility as Visibility,
      flashcardList,
      id,
    });
    return { quiz: quizObjResult };
  },

  async update({
    dataCurrentQuiz,
    dataToUpdateQuiz,
  }: {
    dataCurrentQuiz: Quiz;
    dataToUpdateQuiz: {
      title?: string;
      description?: string;
      visibility?: Visibility.PUBLIC | Visibility.PRIVATE;
    };
  }) {
    if (!dataCurrentQuiz || !dataToUpdateQuiz) return null;

    const quizUpdated = await prisma.quiz.update({
      where: {
        id: dataCurrentQuiz.id,
      },
      data: dataToUpdateQuiz,
      include: {
        flashcardList: true,
      },
    });

    const { userId, title, description, visibility, flashcardList, id } =
      quizUpdated;

    const quizObjResult = new Quiz({
      userId,
      title,
      description: description ?? undefined,
      visibility: visibility as Visibility,
      flashcardList,
      id,
    });

    return { quiz: quizObjResult.toObject() };
  },

  async delete(quizId: string) {
    const deletedQuiz = await prisma.quiz.delete({
      where: {
        id: quizId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        userId: true,
        visibility: true,
        flashcardList: true,
      },
    });

    const { userId, title, description, visibility, flashcardList, id } =
      deletedQuiz;

    const quizObjResult = new Quiz({
      userId,
      title,
      description: description ?? undefined,
      visibility: visibility as Visibility,
      flashcardList,
      id,
    });
    return { quiz: quizObjResult.toObject() };
  },

  async addFlashcardToQuiz({
    quizObj,
    newFlashcard,
  }: {
    quizObj: Quiz;
    newFlashcard: FlashcardDTO;
  }) {
    if (!quizObj || !newFlashcard) return null;

    const newFlashcardObj = new Flashcard(newFlashcard);

    await prisma.flashcard.create({
      data: {
        id: newFlashcardObj.id,
        quizId: quizObj.id,
        term: newFlashcardObj.getTerm(),
        description: newFlashcardObj.getDescription(),
        create_at: newFlashcardObj.create_at,
      },
      select: {
        id: true,
        quizId: true,
        term: true,
        description: true,
      },
    });

    const foundQuizById = await prisma.quiz.findUnique({
      where: {
        id: quizObj.id,
      },
      include: { flashcardList: true },
    });

    if (!foundQuizById) return null;

    const { userId, title, description, visibility, flashcardList, id } =
      foundQuizById;

    const quizObjResult = new Quiz({
      userId,
      title,
      description: description ?? undefined,
      visibility: visibility as Visibility,
      flashcardList,
      id,
    });

    return { quiz: quizObjResult.toObject(true) };
  },

  async addMultipleFlashcardToQuiz({
    quizObj,
    newsFlashcard,
  }: {
    quizObj: Quiz;
    newsFlashcard: FlashcardDTO[];
  }) {
    if (!quizObj || !newsFlashcard) return null;

    const flashcardObjList = newsFlashcard.map((flashcard) => {
      const { term, description } = flashcard;
      return new Flashcard({ term, description });
    });

    const flashcardCreateList = flashcardObjList.map((flashcard) => ({
      term: flashcard.getTerm(),
      description: flashcard.getDescription(),
      quizId: quizObj.id,
      create_at: flashcard.create_at,
    }));

    await prisma.flashcard.createMany({
      data: flashcardCreateList,
      skipDuplicates: true,
    });

    const foundQuizById = await prisma.quiz.findUnique({
      where: {
        id: quizObj.id,
      },
      include: { flashcardList: true },
    });

    if (!foundQuizById) return null;

    const { userId, title, description, visibility, flashcardList, id } =
      foundQuizById;

    const quizObjResult = new Quiz({
      userId,
      title,
      description: description ?? undefined,
      visibility: visibility as Visibility,
      flashcardList,
      id,
    });

    if (!quizObjResult) return null;

    return { quiz: quizObjResult.toObject(true) };
  },
};
