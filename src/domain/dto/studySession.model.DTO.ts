import { Flashcard } from "../model/flashcard.model";
import { Status } from "../model/studySession.model";

export interface StudySessionDTO {
  userId: string;
  quizId: string;
  flashcardList: Flashcard[];
  flashcardViewLaterList?: Flashcard[];
  status?: Status;
  startTime?: Date;
}
