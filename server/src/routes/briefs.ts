import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { listMeta, parseListQuery } from "../lib/list-query.js";
import { requireAuth, type AuthedRequest } from "../middleware/requireAuth.js";

export const briefsRouter = Router();
briefsRouter.use(requireAuth);

briefsRouter.get("/", async(req: AuthedRequest, res,next)=> {
      try {
            const userId = req.userId!;
            const {q, page, pageSize, skip} = parseListQuery(req.query as Record<string, unknown>);

            const where = {
                  userId,
                  ...(q? {
                        OR: [
                              {symbols: {
                                    contains: q,
                                    mode: "insensitive" as const
                              }},
                              {
                                    content: {
                                          contains: q,
                                          mode: "insensitive" as const
                                    }
                              }
                              
                        ]
                  }: {}),
            }

            const [briefs, total] = await Promise.all([
                  prisma.brief.findMany({
                        where,
                        orderBy: {
                               createdAt: "desc"
                        },
                        skip,
                        take: pageSize,
                  }),
                  prisma.brief.count({where}),
            ])
            return res.json({
                  briefs,
                  ...listMeta(page, pageSize,total),
            });
      } catch (err) {
          return next(err);
      }
})