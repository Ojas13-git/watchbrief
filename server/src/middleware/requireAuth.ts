import { getAuth } from "@clerk/express";
import type { Request, Response, NextFunction } from "express";

export type AuthedRequest = Request & { userId?: string };

export function requireAuth(
  req: AuthedRequest,
  res: Response,
  next: NextFunction,
) {
  const { userId } = getAuth(req);
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  req.userId = userId;
  return next();
}
