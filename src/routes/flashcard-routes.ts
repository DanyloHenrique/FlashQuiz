import { Router, Response, NextFunction } from "express";
import authenticateToken, {
  AuthenticatedRequest,
} from "../middleware/authenticateToken";
import { flashcardController } from "../controller/flashcard/flashcard-controller";

const router = Router();

router.put(
  "/quiz/:quizId/flashcard/:flashcardId",
  authenticateToken,
  (request: AuthenticatedRequest, response: Response, next: NextFunction) => {
    flashcardController.update(request, response, next);
  },
);

export default router;
