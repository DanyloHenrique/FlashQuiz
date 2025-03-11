import { Router, Request, Response, NextFunction } from "express";
import authenticateToken, {
    AuthenticatedRequest,
  } from "../middleware/authenticateToken";
import { quizController } from "../controller/quiz/quiz-controller";
  


const router = Router()

router.post("/quiz", authenticateToken, (request: Request, response: Response, next: NextFunction)=>{
    quizController.create(request, response, next)
});

export default router