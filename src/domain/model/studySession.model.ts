import { uuid } from "uuidv4";
import { StudySessionDTO } from "../dto/studySession.model.DTO";
import { Flashcard } from "./flashcard.model";

export enum Status {
  PROGRESS = "progress",
  COMPLETED = "completed",
  PAUSED = "paused",
}

export class StudySession {
  readonly userId: string;
  readonly quizId: string;
  readonly id: string;
  private flashcardList: Flashcard[] = [];
  private flashcardViewLaterList: Flashcard[] = [];
  private status: Status.COMPLETED | Status.PAUSED | Status.PROGRESS =
    Status.PAUSED;
  private totalTimeInMinutes: number | null;
  readonly startTime: Date;
  private endTime: Date | null;

  constructor({
    userId,
    quizId,
    flashcardList,
    flashcardViewLaterList,
    status,
    startTime,
    id,
  }: StudySessionDTO & { id?: string }) {
    this.id = id ?? uuid();
    this.userId = userId;
    this.quizId = quizId;
    this.flashcardList = flashcardList;
    this.flashcardViewLaterList = flashcardViewLaterList ?? [];
    this.status = status ?? Status.PROGRESS;
    this.totalTimeInMinutes = 0;
    this.startTime = startTime ?? new Date();
    this.endTime = null;
  }

  static fromPrisma(raw: any): StudySession {
    return new StudySession({
      id: raw.id,
      userId: raw.userId,
      quizId: raw.quizId,
      status: raw.status,
      startTime: raw.startTime,
      flashcardList: raw.StudySessionFlashcard.map(
        (sessionFlashcard: any) =>
          new Flashcard({
            id: sessionFlashcard.flashcard.id,
            term: sessionFlashcard.flashcard.term,
            description: sessionFlashcard.flashcard.description,
            create_at: sessionFlashcard.flashcard.create_at,
          }),
      ),
      flashcardViewLaterList: (raw.flashcardViewLaterList ?? []).map(
        (sessionFlashcard: any) =>
          new Flashcard({
            id: sessionFlashcard.flashcard.id,
            term: sessionFlashcard.flashcard.term,
            description: sessionFlashcard.flashcard.description,
            create_at: sessionFlashcard.flashcard.create_at,
          }),
      ),
    });
  }

  public toObject() {
    return {
      id: this.id,
      userId: this.userId,
      quizId: this.quizId,
      flashcardList: this.flashcardList,
      flashcardViewLaterList: this.flashcardViewLaterList,
      status: this.status,
      totalTimeInMinutes: this.totalTimeInMinutes,
      startTime: this.startTime,
      endTime: this.endTime,
    };
  }

  public isFinish(): boolean {
    return this.status === Status.COMPLETED;
  }
  
  public getFlashcardList() {
    return this.flashcardList;
  }

  public getFlashcardViewLaterList() {
    return this.flashcardViewLaterList;
  }

  public getTotalTime() {
    return this.totalTimeInMinutes;
  }

  public getStatus() {
    return this.status;
  }

  public getFlashcardUnique(id: string) {
    const flashcard = this.flashcardList.find(
      (flashcard) => flashcard.id === id,
    );

    return flashcard;
  }

  public setFlashcardViewLaterList(flashcard: Flashcard) {
    this.flashcardViewLaterList = [...this.flashcardViewLaterList, flashcard];
  }

  public setEndTime(endTimeParam?: Date) {
    this.endTime = endTimeParam || new Date();
  }

  public setTotalTime(totalTimeParam?: number) {
    if (totalTimeParam) {
      this.totalTimeInMinutes = totalTimeParam;
    }

    if (!this.startTime || !this.endTime) return null;
    const millisecondsForMinutes = 1000 * 60;
    this.totalTimeInMinutes =
      (this.endTime.getTime() - this.startTime.getTime()) /
      millisecondsForMinutes;
  }

  public setStatus(status: Status) {
    this.status = status;
  }
}
