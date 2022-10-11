import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

import authConfig from "../config/auth";
import AppError from "../errors/AppError";

interface TokenPayload {
  id: string;
  name: string;
  exp: number;
  sub: string;
}

export const ensureAutenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError("Token is missing");
  }

  const [, token] = authHeader.split(" ");

  try {
    const decodedToken = verify(token, authConfig.jwt.secret) as TokenPayload;

    const { id, name } = decodedToken;

    req.user = {
      id,
      name,
    };

    return next();
  } catch {
    throw new AppError("Invalid JWT Token");
  }
};
