import { uuid } from "uuidv4";
import { FlashcardDTO } from "../dto/flashcard.model.DTO";

export class Flashcard {
  readonly id: string;
  private term: string;
  private description: string;
  readonly create_at: Date;

  constructor({ term, description }: FlashcardDTO) {
    this.id = uuid();
    this.term = term;
    this.description = description;
    this.create_at = new Date();
  }

  public toObject() {
    const { create_at, ...FlashcardWithoutDate } = this;
    return FlashcardWithoutDate;
  }

  public getTerm() {
    return this.term;
  }

  public getDescription() {
    return this.description;
  }

  public setTerm(term: string) {
    return (this.term = term);
  }

  public setDescription(description: string) {
    return (this.description = description);
  }
}
