import { Router } from "express";
import { z } from "zod";
import { Prisma } from "../generated/prisma/client.js";
import { prisma } from "../lib/prisma.js";
import { listMeta, parseListQuery } from "../lib/list-query.js";
import { isValidSymbol, normalizeSymbol } from "../lib/symbols.js";
import { requireAuth, type AuthedRequest } from "../middleware/requireAuth.js";

export const watchlistRouter = Router();
watchlistRouter.use(requireAuth);

const MAX_WATCHLIST = 10;

const createBodySchema = z.object({
  symbol: z.string().min(1).max(32),
});

//GET /api/watchlist?q=&page=&pageSize=

watchlistRouter.get("/", async (req: AuthedRequest, res, next) => {
  try {
    const userId = req.userId!;

    const { q, page, pageSize, skip } = parseListQuery(
      req.query as Record<string, unknown>,
    );

    const where = {
      userId,
      ...(q ? { symbol: { contains: q, mode: "insensitive" as const } } : {}),
    };

    const [items, total, watchlistCount] = await prisma.$transaction([
      prisma.watchlistItem.findMany({
        where,
        orderBy: { createdAt: "asc" },
        skip,
        take: pageSize,
      }),
      prisma.watchlistItem.count({ where }),
      prisma.watchlistItem.count({ where: { userId } }),
    ]);

    return res.json({
      items,
      ...listMeta(page, pageSize, total),
      watchlistCount,
    });
  } catch (error) {
    return next(error);
  }
});

//POST /api/watchlist
//Body: { symbol: string }
watchlistRouter.post("/", async (req: AuthedRequest, res, next) => {
  try {
    const userId = req.userId!;

    const parsed = createBodySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: "Invalid Body",
        details: parsed.error.flatten(),
      });
    }

    const symbol = normalizeSymbol(parsed.data.symbol);
    if (!isValidSymbol(symbol)) {
      return res.status(400).json({
        error:
          "Invalid NSE symbol. Use tickers like RELIANCE, HDFCBANK, M&M (optional .NS).",
      });
    }

    const watchlistCount = await prisma.watchlistItem.count({
      where: { userId },
    });

    if (watchlistCount >= MAX_WATCHLIST) {
      return res.status(400).json({
        error: "Watchlist is full. Remove some items to add new ones.",
      });
    }

    try {
      const item = await prisma.watchlistItem.create({
        data: { userId, symbol },
      });
      return res.status(201).json({ item });
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2002"
      ) {
        return res.status(409).json({ error: "Symbol already on watchlist" });
      }
      throw err;
    }
  } catch (error) {
    return next(error);
  }
});

//DELETE /api/watchlist/:id
watchlistRouter.delete("/:id", async (req: AuthedRequest, res, next) => {
  try {
    const userId = req.userId!;
    const id = String(req.params.id);

    const deleted = await prisma.watchlistItem.deleteMany({
      where: { id, userId },
    });

    if (deleted.count === 0) {
      return res.status(404).json({ error: "Ticker not found" });
    }
    
    return res.json({ok: true});
  } catch (error) {
    return next(error);
  }
});
