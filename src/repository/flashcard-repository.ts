import { Flashcard } from "../domain/model/flashcard.model";
import { FlashcardDTO } from "../domain/dto/flashcard.model.DTO";

export const flashcards: Flashcard[] = [];

export const flashcardRepository = {
  update({
    flashcardCurrentData,
    flashcardToUpdateData,
  }: {
    flashcardCurrentData: Flashcard;
    flashcardToUpdateData: Partial<FlashcardDTO>;
  }) {
    if (!flashcardCurrentData || !flashcardToUpdateData) return null;

    if (flashcardToUpdateData.term !== undefined) {
      flashcardCurrentData.setTerm(flashcardToUpdateData.term);
    }

    if (flashcardToUpdateData.description !== undefined) {
      flashcardCurrentData.setDescription(flashcardToUpdateData.description);
    }

    return { flashcard: flashcardCurrentData.toObject() };
  },

  delete({
    flashcardId,
    flashcardList,
  }: {
    flashcardId: string;
    flashcardList: Flashcard[];
  }) {
    const flashcardIndexInList = flashcardList.findIndex(
      (flashcard) => flashcard.id === flashcardId,
    );

    if (flashcardIndexInList === -1) return null;

    const deletedFlashcard = flashcardList.splice(flashcardIndexInList, 1)[0];

    return { flashcard: deletedFlashcard.toObject() };
  },
};
