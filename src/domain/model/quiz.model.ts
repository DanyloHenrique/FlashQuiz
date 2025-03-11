import { uuid } from "uuidv4";
import { Flashcard } from "./flashcard.model";
import { QuizDTO } from "../dto/quiz.model.DTO";

export enum Visibility {
  PUBLIC = "public",
  PRIVATE = "private",
}

export class Quiz {
  private flashcard: Flashcard[] = [];
  readonly id: string;
  readonly userId: string;
  private title: string;
  private description?: string;
  private visibility: Visibility.PUBLIC | Visibility.PRIVATE =
    Visibility.PUBLIC;
  readonly create_at: Date;

  constructor({ userId, title, description, visibility }: QuizDTO) {
    this.userId = userId;
    this.id = uuid();
    this.title = title;
    this.description = description;
    this.create_at = new Date();
    this.visibility = visibility;
  }

  addFlashcard(flashcard: Flashcard) {
    this.flashcard.push(flashcard);
  }

  public toObject() {
    const { create_at, ...QuizWithoutDate } = this;
    return QuizWithoutDate;
  }

  public getUserId() {
    return this.userId;
  }

  public getTitle() {
    return this.title;
  }

  public getDescription() {
    return this.description;
  }

  public getVisibility(): Visibility.PUBLIC | Visibility.PRIVATE {
    return this.visibility;
  }

  public setTitle(title: string) {
    return (this.title = title);
  }

  public setDescription(description: string) {
    return (this.description = description);
  }

  public setVisibility(visibility: Visibility.PUBLIC | Visibility.PRIVATE) {
    return (this.visibility = visibility);
  }
}
