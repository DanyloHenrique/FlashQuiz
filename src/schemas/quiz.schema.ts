import { z } from "zod";
import { Visibility } from "../domain/model/quiz.model";

const flashcardSchema = z.object({
  term: z.string(),
  description: z.string(),
});

const quizSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  visibility: z.enum([Visibility.PUBLIC, Visibility.PRIVATE]),
  flashcardList: z.array(flashcardSchema).optional(),
});

const quizUpdateSchame = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  visibility: z.enum([Visibility.PUBLIC, Visibility.PRIVATE]).optional(),
});

export { quizSchema, quizUpdateSchame, flashcardSchema };
