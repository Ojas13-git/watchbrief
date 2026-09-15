import { Router } from "express";
import { z } from "zod";
import { requireAuth, type AuthedRequest } from "../middleware/requireAuth.js";
import { searchNseSymbols } from "../lib/yahoo-search.js";

export const symbolsRouter = Router();
symbolsRouter.use(requireAuth);

const querySchema = z.object({
      q: z.string().trim().max(32).optional().default("")
});

symbolsRouter.get("/search", async(req: AuthedRequest, res, next) => {
      try {
            const parsed = querySchema.safeParse(req.query);

            if(!parsed.success) {
                  return res.status(400).json({error: "Invalid query"});
            }

            const q = parsed.data.q;
            if(q.length < 2) {
                  return res.json({results: []});
            }

            try {
                  const results = await searchNseSymbols(q);
                  return res.json({results});
            } catch {
                  return res.status(502).json({error: "Symbol search unavailable"});
            }

      } catch (err) {
            next(err);
      }
});