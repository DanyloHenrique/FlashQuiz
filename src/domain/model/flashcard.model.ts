import { uuid } from "uuidv4";
import { FlashcardDTO } from "../dto/flashcard.model.DTO";

export class Flashcard {
  readonly id: string;
  private term: string;
  private description: string;
  readonly create_at: Date;

  constructor({ term, description, id, create_at }: FlashcardDTO & { id?: string, create_at?: Date }) {
    this.id = id ?? uuid();
    this.term = term;
    this.description = description;
    this.create_at = create_at ?? new Date();
  }

  public toObject() {
    return {
      id: this.id,
      term: this.term,
      description: this.description,
    };
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
