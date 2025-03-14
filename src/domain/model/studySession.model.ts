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
    flashcardViewLaterList = [],
  }: StudySessionDTO) {
    this.id = uuid();
    this.userId = userId;
    this.quizId = quizId;
    this.flashcardList = flashcardList;
    this.flashcardViewLaterList = flashcardViewLaterList;
    this.status = Status.PROGRESS;
    this.totalTimeInMinutes = 0;
    this.startTime = new Date();
    this.endTime = null;
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

  public setEndTime() {
    return (this.endTime = new Date());
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

  public setFlashcardViewLaterList(flashcard: Flashcard) {
    this.flashcardViewLaterList = [...this.flashcardViewLaterList, flashcard];
  }

  public setTotalTime(startTime: Date, endTime: Date) {
    if (!startTime || !endTime) return null;
    const millisecondsForMinutes = 1000 * 60;
    this.totalTimeInMinutes =
      (endTime.getTime() - startTime.getTime()) / millisecondsForMinutes;
  }

  public setStatus(status: Status) {
    this.status = status;
  }
}
