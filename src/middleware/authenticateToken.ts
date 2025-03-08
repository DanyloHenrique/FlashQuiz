import { NextFunction, Request, Response } from "express";
import Jwt, { JwtPayload } from "jsonwebtoken";

require("dotenv").config(); // Carrega as variáveis do .env

const SECRET = process.env.SECRET || "DAKHFBAKFA4G51A8SDF14AS1F";

// Definir a interface para extender o Request e adicionar userId
export interface AuthenticatedRequest extends Request {
  userIdToken?: string; // userId opcional
}

interface TokenPayload {
  userId: string;
  userName: string;
  userEmail: string;
}

export default async function authenticateToken(
  request: AuthenticatedRequest,
  response: Response,
  next: NextFunction,
): Promise<void> {
  const token = request.headers["authorization"]?.split(" ")[1];

  if (!token) {
    response.status(403).json({
      message: "Token não fornecido!",
    });
    return;
  }

  try {
    const decoded = Jwt.verify(token, SECRET) as TokenPayload;

    request.userIdToken = decoded.userId; // Acessa o userId
    request.headers["authorization"] = token

    next(); // Continua para o próximo middleware
  } catch (err) {
    console.error("Token inválido:", (err as Error).message);

    response.status(403).json({
      err: err,
      message: "Token inválido!",
    });

    return;
  }
}
