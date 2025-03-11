import { Visibility } from "../model/quiz.model";
import { FlashcardDTO } from "./flashcard.model.DTO";

export interface QuizDTO {
  userId: string,
  title: string;
  description?: string;
  flashCard?: FlashcardDTO[];
  visibility: Visibility.PUBLIC | Visibility.PRIVATE;
}
