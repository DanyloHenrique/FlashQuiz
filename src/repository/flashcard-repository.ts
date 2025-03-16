import { Flashcard } from "../domain/model/flashcard.model";
import { FlashcardDTO } from "../domain/dto/flashcard.model.DTO";
import prisma from "../lib/prismaClient";

export const flashcards: Flashcard[] = [];

export const flashcardRepository = {
  async update({
    flashcardCurrentData,
    flashcardToUpdateData,
  }: {
    flashcardCurrentData: Flashcard;
    flashcardToUpdateData: Partial<FlashcardDTO>;
  }) {
    if (!flashcardCurrentData || !flashcardToUpdateData) return null;

    const flashcardUpdated = await prisma.flashcard.update({
      where: {
        id: flashcardCurrentData.id,
      },
      data: flashcardToUpdateData,
      select: {
        id: true,
        quizId: true,
        term: true,
        description: true,
      },
    });

    const { id, quizId, description, term } = flashcardUpdated;
    const flashcardObjResult = new Flashcard({ id, description, term });

    return { flashcard: flashcardObjResult };
  },

  async delete({
    flashcardId,
    flashcardList,
  }: {
    flashcardId: string;
    flashcardList: Flashcard[];
  }) {
    if (!flashcardId) return null;

    const flashcardDeleted = await prisma.flashcard.delete({
      where: {
        id: flashcardId,
      },
      select: {
        id: true,
        quizId: true,
        term: true,
        description: true,
      },
    });

    const { id, quizId, description, term } = flashcardDeleted;
    const flashcardObjResult = new Flashcard({ id, description, term });

    return { flashcard: flashcardObjResult };
  },
};
