import { z } from "zod";
import { Visibility } from "../domain/model/quiz.model";

const flashcardSchema = z.object({
  term: z.string(),
  description: z.string(),
});

const flashcardUpdateSchema = z.object({
  flashcardId: z.string(),
  term: z.string().optional(),
  description: z.string().optional(),
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

const arrayFlashcardList = z.object({
  flashcardList: z
    .array(flashcardSchema)
    .min(1, { message: "é necessário pelo menos 1 flashcard" }),
});

export {
  quizSchema,
  quizUpdateSchame,
  flashcardSchema,
  arrayFlashcardList,
  flashcardUpdateSchema,
};
