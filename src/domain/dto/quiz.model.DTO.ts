import { FlashcardDTO } from "./flashcard.model.DTO";

export interface QuizDTO {
  title: string;
  description?: string;
  flashCard: FlashcardDTO[];
}
