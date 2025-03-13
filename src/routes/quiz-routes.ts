import { Router, Request, Response, NextFunction } from "express";
import authenticateToken, {
  AuthenticatedRequest,
} from "../middleware/authenticateToken";
import { quizController } from "../controller/quiz/quiz-controller";

const router = Router();

router.post(
  "/quiz",
  authenticateToken,
  (request: Request, response: Response, next: NextFunction) => {
    quizController.create(request, response, next);
  },
);

router.get(
  "/quiz/user",
  authenticateToken,
  (request: Request, response: Response, next: NextFunction) => {
    quizController.getAllFromUser(request, response, next);
  },
);

router.get(
  "/quiz/public",
  authenticateToken,
  (request: Request, response: Response, next: NextFunction) => {
    quizController.getAllPublic(request, response, next);
  },
);

router.get(
  "/quiz/:id",
  authenticateToken,
  (request: Request, response: Response, next: NextFunction) => {
    quizController.getById(request, response, next);
  },
);

export default router;
