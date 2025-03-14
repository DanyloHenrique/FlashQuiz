import { Router, Response, NextFunction } from "express";
import authenticateToken, {
  AuthenticatedRequest,
} from "../middleware/authenticateToken";
import { studySessionController } from "../controller/studySession/studySession-controller";

const router = Router();

router.post(
  "/studySession/:quizId",
  authenticateToken,
  (request: AuthenticatedRequest, response: Response, next: NextFunction) => {
    studySessionController.create(request, response, next);
  },
);

router.get(
  "/studySession/:studySessionId",
  authenticateToken,
  (request: AuthenticatedRequest, response: Response, next: NextFunction) => {
    studySessionController.getById(request, response, next);
  },
);
export default router;
