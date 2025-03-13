import Jwt from "jsonwebtoken";

export function generateToken(userId: string, userEmail: string, userName: string): string {
  return Jwt.sign(
    { userId, userEmail, userName },
    process.env.SECRET || "default_secret",
    { expiresIn: "1h" }
  );
}

export function verifyToken(token: string): { userId: string; userEmail: string; userName: string } | null {
    try {
      return Jwt.verify(token, process.env.SECRET || "default_secret") as { userId: string; userEmail: string; userName: string };
    } catch (error) {
      return null; // Retorna null se o token for inválido ou expirado
    }
}