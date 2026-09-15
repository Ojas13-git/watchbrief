import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import { requireAuth, type AuthedRequest } from "./middleware/requireAuth.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { watchlistRouter } from "./routes/watchlist.js";
import { briefRouter } from "./routes/brief.js";
import { briefsRouter } from "./routes/briefs.js";
import { symbolsRouter } from "./routes/symbols.js";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: process.env.CORS_ORIGIN ?? "http://localhost:3000",
      credentials: true,
    }),
  );
  app.use(express.json({ limit: "32kb" }));
  app.use(clerkMiddleware());

  app.get("/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.get("/api/me", requireAuth, (req: AuthedRequest, res) => {
    res.json({ userId: req.userId });
  });

  app.use("/api/watchlist", watchlistRouter);
  app.use("/api/brief", briefRouter);
  app.use("/api/briefs", briefsRouter);
  app.use("/api/symbols", symbolsRouter);

  app.use(errorHandler);

  return app;
}
