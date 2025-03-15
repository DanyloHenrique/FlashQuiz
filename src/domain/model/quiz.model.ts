import { uuid } from "uuidv4";
import { Flashcard } from "./flashcard.model";
import { QuizDTO } from "../dto/quiz.model.DTO";
import { FlashcardDTO } from "../dto/flashcard.model.DTO";

export enum Visibility {
  PUBLIC = "public",
  PRIVATE = "private",
}

export class Quiz {
  private flashcardList: Flashcard[] = [];
  readonly id: string;
  readonly userId: string;
  private title: string;
  private description?: string;
  private visibility: Visibility.PUBLIC | Visibility.PRIVATE =
    Visibility.PUBLIC;
  readonly create_at: Date;

  constructor({
    userId,
    title,
    description,
    visibility,
    flashcardList = [],
    id,
  }: QuizDTO & { id?: string }) {
    this.id = id || uuid();
    this.userId = userId;
    this.title = title;
    this.description = description;
    this.create_at = new Date();
    this.visibility = visibility;
    this.flashcardList = flashcardList.map(
      (flashcard) => new Flashcard(flashcard),
    );
  }

  public toObject(isIncludeFlashcards: boolean = false) {
    const result: any = {
      id: this.id,
      userId: this.userId,
      title: this.title,
      description: this.description,
      visibility: this.visibility,
      flashcardList: [],
    };

    if (isIncludeFlashcards) {
      result.flashcardList = this.flashcardList.map((flashcard) =>
        flashcard.toObject(),
      );
    }

    return result;
  }

  public addFlashcard(flashcard: FlashcardDTO) {
    const newFlashcardObj = new Flashcard(flashcard);
    if (newFlashcardObj) {
      this.flashcardList.push(newFlashcardObj);
    }
  }

  public getFlashcardList() {
    return this.flashcardList;
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
