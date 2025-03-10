import { uuid } from "uuidv4";
import { Flashcard } from "./flashcard.model";
import { QuizDTO } from "../dto/quiz.model.DTO";


export class Quiz{
    private flashcard: Flashcard[] = []
    readonly id: string
    private title: string
    private description?: string
    readonly create_at: Date

    constructor({title, description}: QuizDTO){
        this.id = uuid()
        this.title = title
        this.description = description
        this.create_at = new Date()
    }

    addFlashcard(flashcard: Flashcard){
        this.flashcard.push(flashcard)
    }

    public toObject() {
        const { create_at, ...QuizWithoutDate } = this;
        return QuizWithoutDate;
      }
    
      public getTitle() {
        return this.title;
      }
    
      public getDescription() {
        return this.description;
      }
    
      public setTitle(title: string) {
        return (this.title = title);
      }
    
      public setDescription(description: string) {
        return (this.description = description);
      }
}