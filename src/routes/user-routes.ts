import { Router, Request, Response, NextFunction } from "express";
const { userController } = require("../controller/user/user-controller");

import authenticateToken, {
  AuthenticatedRequest,
} from "../middleware/authenticateToken";

const router = Router();

router.get(
  "/user",
  (request: Request, response: Response, next: NextFunction) => {
    userController.getAll(request, response, next);
  },
);

router.get(
  "/user/email",
  (request: Request, response: Response, next: NextFunction) => {
    userController.getByEmail(request, response, next);
  },
);

router.post(
  "/user",
  (request: Request, response: Response, next: NextFunction) => {
    userController.create(request, response, next);
  },
);

router.post(
  "/user/login",
  (request: Request, response: Response, next: NextFunction) => {
    userController.login(request, response, next);
  },
);

router.put(
  "/user/:id",
  authenticateToken,
  (request: AuthenticatedRequest, response: Response, next: NextFunction) => {
    userController.update(request, response, next);
  },
);

router.delete(
  "/user/:id",
  authenticateToken,
  (request: AuthenticatedRequest, response: Response, next: NextFunction) => {
    userController.delete(request, response, next);
  },
);

export default router;
