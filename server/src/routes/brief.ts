import { Router } from "express";
import { groq } from "@ai-sdk/groq"
import { pipeTextStreamToResponse, streamText, toTextStream } from "ai";
import { prisma } from "../lib/prisma.js";
import { requireAuth, type AuthedRequest } from "../middleware/requireAuth.js";

export const briefRouter = Router();
briefRouter.use(requireAuth);

const MODEL_ID = "llama-3.1-8b-instant";
const MAX_WATCHLIST = 10;

const SYSTEM = `You are WatchBrief, a neutral explainer of Indian NSE-listed companies.
Rules:
- Overview only. No buy, sell, hold, or allocation advice.
- Do not invent live prices, LTP, % change, or “today’s” quotes. You have no market data feed.
- Do not claim to be SEBI-registered or a research analyst.
- If unsure, say so. Keep it concise (short paragraphs + bullets).
- Write for a retail reader in India.`;

briefRouter.post("/", async(req: AuthedRequest, res, next)=> {
      try {
           const userId = req.userId!;
           
           if (!process.env.GROQ_API_KEY) {
            return res.status(500).json({ error: "GROQ_API_KEY is not set" });
          }

          const items = await prisma.watchlistItem.findMany({
            where: {userId},
            orderBy: {createdAt: "asc"},
            select: {symbol: true},
          });

          if(items.length === 0){
            return res.status(400).json({
                  error: "No watchlist items found",
            })
          }
          if(items.length > MAX_WATCHLIST){
            return res.status(400).json({
                  error: "Watchlist has too many items",
            })
          }

          const symbols = items.map((i)=> i.symbol)
          const symbolsJoined = symbols.join(",");

          const result = streamText({
            model: groq(MODEL_ID),
            system: SYSTEM,
            prompt: `Write a short briefing for this NSE watchlist: ${symbolsJoined}.
Cover: what the companies do, shared themes/risks, what a curious investor might watch in filings/news — without recommending trades.`,
            async onFinish({text, finishReason}){
                  if(finishReason === "error" || !text.trim()) return;
                  try {
                        await prisma.brief.create({
                              data: {
                                userId,
                                symbols: symbolsJoined,
                                content: text,
                                model: MODEL_ID,
                              },
                            });
                  } catch (err) {
                        console.error("Failed to save Brief after stream", err);
                  }
            },
            
          });

          pipeTextStreamToResponse({
            response: res,
            stream: toTextStream({stream: result.stream}),
          })
      } catch (err) {
            return next(err);
      }
})